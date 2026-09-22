import assert from "node:assert/strict";
import test from "node:test";
import { validateContent } from "../scripts/validate-content.mjs";

test("referências e arquivos de conteúdo permanecem íntegros", () => {
  const { errors } = validateContent();
  assert.deepEqual(errors, []);
});
