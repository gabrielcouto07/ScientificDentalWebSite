"""
Gera os ativos de marca a partir dos arquivos oficiais da Scientific Dental
(pasta SD: PDF/ e "PNG - Sem fundo/").

Uso: python scripts/build-brand-assets.py "C:/caminho/para/SD"

O que sai (tudo em public/brand e app/):
- public/brand/logo-marca.svg      wordmark vetorial em azul-marinho (#262443), extraído do Preto.pdf
- public/brand/logo-branco.svg     mesmo vetor em branco, para fundos escuros
- public/brand/logo-azul.png       PNG oficial recortado ao conteúdo (para e-mail/OG)
- public/brand/logo-branco.png     idem, versão branca
- app/icon.svg                     favicon: o "S" da logo sobre quadrado azul-marinho
- app/apple-icon.png               180x180
- app/opengraph-image.png          1200x630, logo branca sobre azul-marinho

Por que extrair do PDF e não usar só o PNG: o PNG tem 1920x1080 e a marca ocupa
~900 px; no header a 30 px de altura, um SVG fica nítido em qualquer densidade
de tela e pesa 12 KB em vez de 70-100 KB.
"""
import os
import re
import sys

import pymupdf
from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\GABRIEL.CARDOSO\Desktop\SD"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND_DIR = os.path.join(ROOT, "public", "brand")
APP_DIR = os.path.join(ROOT, "app")
os.makedirs(BRAND_DIR, exist_ok=True)

NAVY = "#262443"
WHITE = "#ffffff"


def fmt(n: float) -> str:
    s = f"{n:.2f}".rstrip("0").rstrip(".")
    return s if s else "0"


def drawing_to_path(d) -> str:
    """Converte os itens de um drawing do PyMuPDF em um atributo d de <path>."""
    parts = []
    current = None
    for item in d["items"]:
        op = item[0]
        if op == "l":
            p1, p2 = item[1], item[2]
            if current is None or (abs(p1.x - current.x) > 0.01 or abs(p1.y - current.y) > 0.01):
                if current is not None:
                    parts.append("Z")
                parts.append(f"M{fmt(p1.x)} {fmt(p1.y)}")
            parts.append(f"L{fmt(p2.x)} {fmt(p2.y)}")
            current = p2
        elif op == "c":
            p1, p2, p3, p4 = item[1], item[2], item[3], item[4]
            if current is None or (abs(p1.x - current.x) > 0.01 or abs(p1.y - current.y) > 0.01):
                if current is not None:
                    parts.append("Z")
                parts.append(f"M{fmt(p1.x)} {fmt(p1.y)}")
            parts.append(f"C{fmt(p2.x)} {fmt(p2.y)} {fmt(p3.x)} {fmt(p3.y)} {fmt(p4.x)} {fmt(p4.y)}")
            current = p4
        elif op == "re":
            r = item[1]
            parts.append(f"M{fmt(r.x0)} {fmt(r.y0)}H{fmt(r.x1)}V{fmt(r.y1)}H{fmt(r.x0)}Z")
            current = None
    if current is not None:
        parts.append("Z")
    return "".join(parts)


def extract_glyphs():
    doc = pymupdf.open(os.path.join(SRC, "PDF", "Preto.pdf"))
    page = doc[0]
    glyphs = []
    for d in page.get_drawings():
        # Só os preenchimentos pretos são letras; os brancos são fundo da prancha.
        if d.get("fill") and tuple(round(c, 2) for c in d["fill"]) == (0.0, 0.0, 0.0):
            if d["items"] and d["items"][0][0] == "re":
                continue  # retângulo de fundo / clip
            glyphs.append(d)
    if not glyphs:
        raise SystemExit("Nenhum glifo encontrado em Preto.pdf")
    bbox = glyphs[0]["rect"]
    for g in glyphs[1:]:
        bbox = bbox | g["rect"]
    glyphs.sort(key=lambda g: (g["rect"].y0 > bbox.y0 + 50, g["rect"].x0))
    return glyphs, bbox


def svg_for(glyphs, bbox, fill: str, pad: float = 1.0) -> str:
    x0, y0 = bbox.x0 - pad, bbox.y0 - pad
    w, h = bbox.width + 2 * pad, bbox.height + 2 * pad
    paths = "".join(f'<path d="{drawing_to_path(g)}"/>' for g in glyphs)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w)} {fmt(h)}" role="img" '
        f'aria-label="Scientific Dental"><g fill="{fill}" transform="translate({fmt(-x0)} {fmt(-y0)})">{paths}</g></svg>'
    )


def render_svg(svg: str, width: int) -> Image.Image:
    doc = pymupdf.open(stream=svg.encode("utf-8"), filetype="svg")
    page = doc[0]
    zoom = width / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=True)
    return Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)


def main():
    glyphs, bbox = extract_glyphs()
    print(f"{len(glyphs)} glifos; bbox {bbox} ({bbox.width:.1f} x {bbox.height:.1f}, proporcao {bbox.width / bbox.height:.3f}:1)")

    # 1) Wordmark vetorial
    navy_svg = svg_for(glyphs, bbox, NAVY)
    white_svg = svg_for(glyphs, bbox, WHITE)
    with open(os.path.join(BRAND_DIR, "logo-marca.svg"), "w", encoding="utf-8") as f:
        f.write(navy_svg)
    with open(os.path.join(BRAND_DIR, "logo-branco.svg"), "w", encoding="utf-8") as f:
        f.write(white_svg)
    print(f"logo-marca.svg {len(navy_svg) / 1024:.1f} KB")

    # 2) PNGs oficiais recortados (mantém o arquivo do cliente, só tira o ar em volta)
    for name, out in (("Azul", "logo-azul.png"), ("Branco", "logo-branco.png"), ("Cinza", "logo-cinza.png"), ("Preto", "logo-preto.png")):
        src = os.path.join(SRC, "PNG - Sem fundo", f"{name}.png")
        if not os.path.exists(src):
            continue
        im = Image.open(src).convert("RGBA")
        bb = im.getbbox()
        pad = 24
        crop = im.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad)))
        crop.save(os.path.join(BRAND_DIR, out), optimize=True)
        print(f"{out} {crop.size}")

    # 3) Favicon: o "S" (primeiro glifo à esquerda) em branco sobre quadrado azul-marinho
    s_glyph = min(glyphs, key=lambda g: g["rect"].x0)
    sb = s_glyph["rect"]
    size = 64
    # O S ocupa ~62 % do quadrado, centralizado
    scale = (size * 0.62) / max(sb.width, sb.height)
    tx = (size - sb.width * scale) / 2 - sb.x0 * scale
    ty = (size - sb.height * scale) / 2 - sb.y0 * scale
    icon_svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">'
        f'<rect width="{size}" height="{size}" rx="14" fill="{NAVY}"/>'
        f'<path fill="{WHITE}" transform="matrix({fmt(scale)} 0 0 {fmt(scale)} {fmt(tx)} {fmt(ty)})" d="{drawing_to_path(s_glyph)}"/>'
        f"</svg>"
    )
    with open(os.path.join(APP_DIR, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(icon_svg)
    # apple-icon: mesmo desenho, sem cantos arredondados (o iOS arredonda sozinho)
    apple_svg = icon_svg.replace('rx="14"', 'rx="0"')
    render_svg(apple_svg, 180).convert("RGB").save(os.path.join(APP_DIR, "apple-icon.png"), optimize=True)
    print("icon.svg + apple-icon.png")

    # 4) Open Graph padrão: logo branca centralizada sobre azul-marinho, com tagline
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), NAVY)
    logo = render_svg(white_svg, 720)
    og.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2 - 40), logo)
    draw = ImageDraw.Draw(og)
    try:
        font = ImageFont.truetype("segoeui.ttf", 30)
    except OSError:
        font = ImageFont.load_default()
    tagline = "Venda e assistência técnica oficial J. Morita e Carestream no Brasil"
    tw = draw.textlength(tagline, font=font)
    draw.text(((W - tw) / 2, (H + logo.height) // 2 + 8), tagline, fill="#cbcfdb", font=font)
    # linha de medição, o único ornamento do site
    y = (H + logo.height) // 2 + 72
    draw.line((W / 2 - 60, y, W / 2 + 60, y), fill="#d6302b", width=3)
    draw.line((W / 2 - 60, y - 8, W / 2 - 60, y + 8), fill="#d6302b", width=3)
    draw.line((W / 2 + 60, y - 8, W / 2 + 60, y + 8), fill="#d6302b", width=3)
    og.save(os.path.join(APP_DIR, "opengraph-image.png"), optimize=True)
    print("opengraph-image.png")


if __name__ == "__main__":
    main()
