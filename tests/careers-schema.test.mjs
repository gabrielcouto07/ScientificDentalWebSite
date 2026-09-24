import assert from "node:assert/strict";
import test from "node:test";
import { careersSchema, checkCv, cvFilename, CV_MAX_BYTES } from "../lib/careers-schema.ts";

const candidate = { name: "Pessoa de teste", email: "qa@example.invalid", phone: "(31) 99999-9999", consent: "on" };
const PDF = Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]);
const DOCX = Uint8Array.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
const DOC = Uint8Array.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1]);

test("candidatura exige nome, contato válido e consentimento; o resto é opcional", () => {
  assert.equal(careersSchema.safeParse(candidate).success, true);
  assert.equal(careersSchema.safeParse({ ...candidate, consent: undefined }).success, false);
  assert.equal(careersSchema.safeParse({ ...candidate, phone: "123" }).success, false);
  assert.equal(careersSchema.safeParse({ ...candidate, message: "x".repeat(1501) }).success, false);
});

test("LinkedIn aceita perfil com ou sem https e recusa outros domínios", () => {
  for (const linkedin of ["", "linkedin.com/in/pessoa", "https://www.linkedin.com/in/pessoa", "https://br.linkedin.com/in/pessoa"]) {
    assert.equal(careersSchema.safeParse({ ...candidate, linkedin }).success, true, linkedin);
  }
  for (const linkedin of ["https://example.com/in/pessoa", "javascript:alert(1)", "linkedin.com"]) {
    assert.equal(careersSchema.safeParse({ ...candidate, linkedin }).success, false, linkedin);
  }
});

test("currículo é conferido por extensão, tamanho e assinatura do arquivo", () => {
  assert.deepEqual(checkCv({ name: "cv.pdf", size: 1000 }, PDF), { ok: true, kind: "pdf", mime: "application/pdf" });
  assert.equal(checkCv({ name: "CV.DOCX", size: 1000 }, DOCX).ok, true);
  assert.equal(checkCv({ name: "cv.doc", size: 1000 }, DOC).ok, true);
  // extensão trocada: um executável renomeado não passa
  assert.equal(checkCv({ name: "cv.pdf", size: 1000 }, Uint8Array.from([0x4d, 0x5a, 0, 0])).ok, false);
  assert.equal(checkCv({ name: "cv.exe", size: 1000 }, PDF).ok, false);
  assert.equal(checkCv({ name: "cv.pdf", size: 0 }, PDF).ok, false);
  assert.equal(checkCv({ name: "cv.pdf", size: CV_MAX_BYTES + 1 }, PDF).ok, false);
});

test("nome do anexo remove acentos e caracteres problemáticos", () => {
  assert.equal(cvFilename("João da Conceição", "pdf"), "CV - Joao da Conceicao.pdf");
  assert.equal(cvFilename("../../etc/passwd", "docx"), "CV - etcpasswd.docx");
  assert.equal(cvFilename("***", "doc"), "CV - candidato.doc");
});
