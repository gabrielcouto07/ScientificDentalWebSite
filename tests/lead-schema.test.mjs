import assert from "node:assert/strict";
import test from "node:test";
import { leadSchema } from "../lib/lead-schema.ts";
import options from "../content/forms.json" with { type: "json" };

const contact = { kind: "contato", name: "Pessoa de teste", phone: "(31) 99999-9999", email: "qa@example.invalid", consent: "on" };

test("telefone exige DDD e dígitos, não apenas comprimento de texto", () => {
  for (const phone of ["()--------", "123456", "00000000000", "+55 (31) ----"]) {
    assert.equal(leadSchema.safeParse({ ...contact, phone }).success, false, phone);
  }
  for (const phone of ["(31) 2112-1900", "+55 (31) 99999-9999"]) {
    assert.equal(leadSchema.safeParse({ ...contact, phone }).success, true, phone);
  }
});

test("orçamento exige escolhas válidas nas três etapas, inclusive no servidor", () => {
  const result = leadSchema.safeParse({ ...contact, kind: "orcamento" });
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues.map((i) => i.path[0]), ["equipment", "operation", "timeline"]);
  assert.equal(leadSchema.safeParse({ ...contact, kind: "orcamento", equipment: options.equipment[0].value, operation: options.operation[0].value, timeline: options.timeline[0].value }).success, true);
});

test("consentimento explícito e limites da mensagem são obrigatórios", () => {
  assert.equal(leadSchema.safeParse({ ...contact, consent: undefined }).success, false);
  assert.equal(leadSchema.safeParse({ ...contact, message: "x".repeat(2001) }).success, false);
  for (const kind of ["contato", "suporte", "produto"]) assert.equal(leadSchema.safeParse({ ...contact, kind }).success, true);
});
