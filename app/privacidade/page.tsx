import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getSite } from "@/lib/content";
import { PRIVACY_POLICY_VERSION } from "@/lib/leads";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidade",
  description: "Como a Scientific Dental trata dados pessoais coletados no site, conforme a LGPD (Lei 13.709/2018).",
  path: "/privacidade",
});

/**
 * Minuta de política de privacidade para revisão jurídica do cliente.
 * VERIFICAR: encarregado (DPO), CNPJ, prazo de retenção e lista de operadores.
 */
export default function PrivacidadePage() {
  const site = getSite();
  return (
    <main id="conteudo" className="flex-1">
      <PageHero
        compact
        eyebrow="LGPD"
        title="Política de privacidade"
        lead="Como a Scientific Dental trata os dados pessoais coletados neste site, conforme a Lei 13.709/2018."
      />
      <Container className="py-12 sm:py-16">
        <p className="font-mono text-sm text-tecido">Versão {PRIVACY_POLICY_VERSION}</p>
        <div className="prose-measure mt-8 space-y-8 text-base">
          <section>
            <h2 className="text-xl sm:text-2xl">Quem trata os dados</h2>
            <p className="mt-2">
              {site.legalName}, com sede em {site.address.street}, {site.address.district}, {site.address.city}/
              {site.address.state}, CEP {site.address.postalCode}, é a controladora dos dados pessoais coletados
              neste site. Contato do encarregado:{" "}
              <a href={`mailto:${site.emails.privacy}`} className="link">
                {site.emails.privacy}
              </a>
              .{/* VERIFICAR: CNPJ e nome do encarregado (DPO) */}
            </p>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl">Quais dados coletamos e por quê</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Formulários</strong> (orçamento, contato, chamado técnico): nome, telefone, e-mail, empresa,
                cidade e a mensagem enviada. Finalidade: responder ao seu pedido e elaborar propostas. Base legal:
                consentimento, dado na caixa de aceite de cada formulário, e execução de medidas pré-contratuais.
              </li>
              <li>
                <strong>Trabalhe conosco</strong>: nome, telefone, e-mail, cidade, perfil do LinkedIn, apresentação e o
                currículo anexado. Finalidade: avaliar o perfil em processos seletivos e manter o currículo no banco de
                talentos. Base legal: consentimento, dado na caixa de aceite do formulário. O currículo é enviado por
                e-mail à equipe de Recursos Humanos e não é usado para fins comerciais.
              </li>
              <li>
                <strong>Registros técnicos</strong>: endereço IP, navegador e páginas acessadas, nos logs da
                hospedagem, para segurança e funcionamento do site. Base legal: legítimo interesse.
              </li>
              <li>
                <strong>Cookies de medição</strong>: só entram se você aceitar no aviso de cookies. Sem aceite, o site
                usa apenas o armazenamento necessário para guardar a sua escolha.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl">Por quanto tempo guardamos</h2>
            <p className="mt-2">
              Dados de formulários ficam guardados por até 24 meses após o último contato, ou até você pedir a
              exclusão. Currículos ficam no banco de talentos por até 12 meses, ou até você pedir a exclusão.
              {/* VERIFICAR: prazo de guarda de currículos definido pelo RH e jurídico */} Logs técnicos são mantidos por até 6 meses, conforme o Marco Civil da Internet.
              {/* VERIFICAR: prazos de retenção acordados com o jurídico */}
            </p>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl">Com quem compartilhamos</h2>
            <p className="mt-2">
              Com os operadores necessários para o serviço: hospedagem do site, serviço de e-mail e o sistema de
              gestão de relacionamento comercial usado pela equipe de vendas. Não vendemos nem cedemos dados a
              terceiros para outros fins.
              {/* VERIFICAR: nomear operadores (Vercel, provedor SMTP, CRM) */}
            </p>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl">Seus direitos</h2>
            <p className="mt-2">
              Você pode pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade, exclusão e
              revogação do consentimento, conforme os artigos 17 a 22 da Lei 13.709/2018 (LGPD). Basta escrever para{" "}
              <a href={`mailto:${site.emails.privacy}`} className="link">
                {site.emails.privacy}
              </a>
              . Respondemos em até 15 dias.
            </p>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl">WhatsApp</h2>
            <p className="mt-2">
              Os botões de WhatsApp abrem uma conversa no aplicativo com uma mensagem pré-preenchida. O tratamento
              dessa conversa segue a política de privacidade do WhatsApp e a desta empresa.
            </p>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl">Alterações</h2>
            <p className="mt-2">
              Esta política pode ser atualizada. A versão vigente é sempre a publicada nesta página, identificada pela
              data no topo.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
