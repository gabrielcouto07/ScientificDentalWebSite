import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

// Resolve as convenções do Next no runner nativo; nenhuma implementação é mockada.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") return { url: "data:text/javascript,export {}", shortCircuit: true };
    let url;
    if (specifier.startsWith("@/")) url = new URL(`../${specifier.slice(2)}`, import.meta.url);
    else if (specifier.startsWith(".")) url = new URL(specifier, context.parentURL);
    if (url?.protocol === "file:") {
      if (existsSync(new URL(`${url.href}.ts`))) url = new URL(`${url.href}.ts`);
      return nextResolve(url.href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".json")) context = { ...context, importAttributes: { type: "json" } };
    return nextLoad(url, context);
  },
});

const { processApplication } = await import("../lib/careers-submission.ts");
const { applicationMail, deliverApplication } = await import("../lib/careers.ts");
const site = (await import("../content/site.json", { with: { type: "json" } })).default;
const PDF = Buffer.from("%PDF-1.7\nCurrículo de teste\n");
const FAILURE = "Não conseguimos enviar seu currículo agora. Tente de novo ou envie direto para o e-mail do RH.";

function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "  João da Conceição  ", email: "  candidato@example.invalid  ",
    phone: "(31) 99999-9999", city: "Belo Horizonte/MG",
    linkedin: "https://www.linkedin.com/in/candidato", message: "Minha apresentação", consent: "on", website: "  ",
  })) data.set(key, value);
  // O MIME do navegador não deve substituir o MIME identificado pela assinatura.
  data.set("cv", new File([PDF], "arquivo-original.pdf", { type: "application/octet-stream" }));
  return data;
}

function dependencies(t, deliver) {
  return {
    requestIp: t.mock.fn(async () => "192.0.2.1"),
    consumeLeadRateLimit: t.mock.fn(async () => true),
    deliverApplication: t.mock.fn(deliver),
  };
}

function assertMail(mail, application, to) {
  assert.equal(mail.to, to);
  assert.equal(mail.replyTo, "candidato@example.invalid");
  assert.equal(mail.subject, "[Site] Currículo · João da Conceição");
  assert.equal(mail.attachments.length, 1);
  assert.equal(mail.attachments[0].filename, "CV - Joao da Conceicao.pdf");
  assert.equal(mail.attachments[0].contentType, "application/pdf");
  assert.deepEqual(mail.attachments[0].content, PDF);
  assert.strictEqual(mail.attachments[0].content, application.cv.content);
  for (const value of [application.id, application.receivedAt, application.consent.policyVersion,
    "Belo Horizonte/MG", "https://www.linkedin.com/in/candidato", "Minha apresentação"]) {
    assert.ok(mail.text.includes(value), value);
  }
}

function mailEnvironment(t, to) {
  for (const [key, value] of Object.entries({ CAREERS_TO: to, LEAD_FROM: "site@example.invalid" })) {
    const previous = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
    t.after(() => {
      if (previous === undefined) delete process.env[key];
      else process.env[key] = previous;
    });
  }
}

test("candidatura válida entrega CV íntegro e reply-to ao CAREERS_TO e retorna protocolo", async (t) => {
  const to = "rh@example.invalid,outro-rh@example.invalid";
  mailEnvironment(t, to);
  let application;
  const sendMail = t.mock.fn(async () => ({}));
  const deps = dependencies(t, async (app) => {
    application = app;
    return deliverApplication(app, { sendMail });
  });
  const result = await processApplication(form(), deps);
  assert.deepEqual(result, { status: "success", id: application.id });
  assert.match(result.id, /^RH-/);
  assert.equal(application.consent.accepted, true);
  assert.equal(application.consent.at, application.receivedAt);
  assert.equal(application.cv.size, PDF.length);
  assert.equal(Object.hasOwn(application, "website"), false);
  assert.equal(deps.requestIp.mock.callCount(), 1);
  assert.deepEqual(deps.consumeLeadRateLimit.mock.calls[0].arguments, ["192.0.2.1", "careers"]);
  assert.equal(deps.deliverApplication.mock.callCount(), 1);
  assert.equal(sendMail.mock.callCount(), 1);
  const mail = sendMail.mock.calls[0].arguments[0];
  assert.equal(mail.from, "site@example.invalid");
  assertMail(mail, application, to);
  assert.deepEqual(mail, applicationMail(application, "site@example.invalid", to));
});

test("honeypot retorna sucesso silencioso sem validar CV, consultar IP, consumir cota ou entregar", async (t) => {
  const data = new FormData();
  data.set("website", " https://bot.example.invalid ");
  const deps = dependencies(t, async () => { throw new Error("Não deve entregar"); });
  assert.deepEqual(await processApplication(data, deps), { status: "success", id: "RH-OK" });
  for (const fn of Object.values(deps)) assert.equal(fn.mock.callCount(), 0);
});

test("falha do transporte retorna erro sem protocolo e usa RH padrão com anexo e reply-to corretos", async (t) => {
  mailEnvironment(t, "");
  const error = new Error("SMTP indisponível");
  const log = t.mock.method(console, "error", () => {});
  const sendMail = t.mock.fn(async () => { throw error; });
  let application;
  const deps = dependencies(t, async (app) => {
    application = app;
    return deliverApplication(app, { sendMail });
  });
  assert.deepEqual(await processApplication(form(), deps), { status: "error", message: FAILURE });
  assert.equal(sendMail.mock.callCount(), 1);
  assertMail(sendMail.mock.calls[0].arguments[0], application, site.emails.hr);
  assert.deepEqual(log.mock.calls[0].arguments, ["[careers] falha de entrega:", error]);
});

test("rate limit recusado impede entrega", async (t) => {
  const deps = dependencies(t, async () => true);
  deps.consumeLeadRateLimit = t.mock.fn(async () => false);
  const result = await processApplication(form(), deps);
  assert.equal(result.status, "error");
  assert.match(result.message, /Muitas tentativas/);
  assert.equal(deps.deliverApplication.mock.callCount(), 0);
});
