"""Optional browser QA: pip install playwright; use an installed Chromium.
Run after npm run build and npm run start -- --port 3001.
No browser/testing package is added to the site's dependencies.
"""
import json, os, re, sys, tempfile
from pathlib import Path
from urllib.parse import urlsplit, unquote
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('QA_BASE_URL', 'http://localhost:3001')
OUTPUT = Path(tempfile.gettempdir()) / 'scientific-qa'
OUTPUT.mkdir(exist_ok=True)
products = [json.loads(p.read_text(encoding='utf-8')) for p in (ROOT/'content/products').glob('*.json')]
categories = json.loads((ROOT/'content/categories.json').read_text(encoding='utf-8'))
articles = json.loads((ROOT/'content/articles.json').read_text(encoding='utf-8'))
routes = ['/', '/produtos', '/suporte', '/contato', '/orcamento', '/a-scientific', '/legacy-sd', '/conteudo', '/privacidade', '/trabalhe-conosco']
routes += ['/produtos/'+p['slug'] for p in categories+products]
routes += ['/conteudo/'+a['slug'] for a in articles]
issues, links, checks = [], set(), []
axe = Path(tempfile.gettempdir())/'scientific-axe.min.js'
with sync_playwright() as pw:
    candidates = list((Path(os.environ.get('LOCALAPPDATA',''))/'ms-playwright').glob('chromium-*/chrome-win64/chrome.exe'))
    browser = pw.chromium.launch(**({'executable_path':str(candidates[-1])} if candidates else {}))
    context = browser.new_context(reduced_motion='reduce')
    context.add_init_script("localStorage.setItem('sd-consent-v1','essential')")
    page = context.new_page()
    page.on('pageerror', lambda error: issues.append({'runtime':str(error)}))
    for width in [360,768,1024,1440,1920]:
        page.set_viewport_size({'width':width,'height':900})
        for route in routes:
            response = page.goto(BASE+route)
            page.locator('h1').wait_for()
            page.evaluate('document.fonts.ready')
            # Wait for hydration and deferred catalog rendering.
            page.wait_for_timeout(100)
            metrics = page.evaluate('''() => ({
              overflow: document.documentElement.scrollWidth-innerWidth,
              h1: document.querySelectorAll('h1').length,
              images: [...document.images].filter(i=>!i.hasAttribute('alt')).map(i=>i.src),
              clipped: [...document.querySelectorAll('main h1, main h2, main p, main button, main a')].filter(e=>{
                const r=e.getBoundingClientRect(); if(!r.width || r.right<=innerWidth+2) return false;
                for(let p=e.parentElement;p;p=p.parentElement) if(['auto','scroll'].includes(getComputedStyle(p).overflowX)) return false;
                return true;
              }).map(e=>e.textContent.trim().slice(0,70))
            })''')
            checks.append({'width':width,'route':route,'status':response.status,'overflow':metrics['overflow']})
            if response.status!=200 or metrics['overflow']>0 or metrics['h1']!=1 or metrics['images'] or metrics['clipped']:
                issues.append({'route':route,'width':width,'metrics':metrics,'status':response.status})
            if width==360:
                for href in page.locator('a[href]').evaluate_all('(els)=>els.map(e=>e.getAttribute("href"))'):
                    if href.startswith('#'): links.add((route,href))
                    elif href.startswith('/'): links.add((route,href))
                for raw in page.locator('script[type="application/ld+json"]').all_text_contents(): json.loads(raw)
            if width in [360,1440] and route in ['/','/produtos','/orcamento','/suporte','/produtos/veraview-x800']:
                if axe.exists():
                    page.add_script_tag(path=str(axe))
                    violations=page.evaluate("async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))")
                    if violations:issues.append({'route':route,'width':width,'axe':violations})
                if route in ['/','/produtos/veraview-x800']:
                    page.screenshot(path=str(OUTPUT/(str(width)+('-home' if route=='/' else '-x800')+'.png')),full_page=True)
        print(f'{width}px: {len(routes)} routes checked',flush=True)
    # Verify every local href and hash collected from every route.
    for owner,href in sorted(links):
        parsed=urlsplit(href)
        route=parsed.path or owner
        if route.startswith('/downloads/'):
            response=context.request.get(BASE+route)
            if response.status!=200:issues.append({'download':href,'status':response.status})
        elif parsed.fragment:
            page.goto(BASE+route)
            if page.locator('[id='+json.dumps(unquote(parsed.fragment))+']').count()==0:issues.append({'anchor':href,'owner':owner})
        else:
            response=context.request.get(BASE+href)
            if response.status!=200:issues.append({'link':href,'owner':owner,'status':response.status})
    redirects=json.loads((ROOT/'content/redirects.json').read_text(encoding='utf-8'))['redirects']
    for item in redirects:
        source=re.sub(r':\w+\*?', 'teste',item['source'])
        for suffix in ['', '/']:
            response=context.request.get(BASE+source+suffix,max_redirects=0)
            if response.status not in [301,308]:issues.append({'redirect':source+suffix,'status':response.status})
    for product in products:
        response=context.request.get(BASE+'/sd/produto/'+product['slug'],max_redirects=0)
        if response.status not in [301,308] or not response.headers.get('location','').endswith('/produtos/'+product['slug']):issues.append({'legacyProduct':product['slug'],'status':response.status})
    for path,status in [('/pagina-inexistente',404),('/produtos/inexistente',404),('/conteudo/inexistente',404),('/sd/wp-json',410),('/sd/xmlrpc.php',410),('/robots.txt',200),('/sitemap.xml',200)]:
        response=context.request.get(BASE+path)
        if response.status!=status:issues.append({'special':path,'status':response.status,'expected':status})
    browser.close()
result={'pages':len(routes),'checks':len(checks),'links':len(links),'issues':issues,'routes':checks}
(OUTPUT/'audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':len(routes),'checks':len(checks),'links':len(links),'issues':issues},ensure_ascii=True),flush=True)
sys.exit(bool(issues))
