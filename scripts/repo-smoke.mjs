import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const rootPackage = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8").replace(/^\uFEFF/, ""));
const requiredScripts = ["format:check", "check:docs", "lint", "typecheck", "test", "verify"];
const requiredDocs = [
  "README.md",
  "docs/engineering-standards.md",
  "memory-bank/architecture.md",
  "memory-bank/product-design.md",
  "memory-bank/implementation-plan.md",
  "memory-bank/progress.md"
];
const requiredEnvTemplates = [
  "apps/api/.env.development.example",
  "apps/api/.env.test.example",
  "apps/api/.env.production.example",
  "apps/web/.env.development.example",
  "apps/web/.env.test.example",
  "apps/web/.env.production.example"
];

requiredScripts.forEach((scriptName) => {
  assert.equal(typeof rootPackage.scripts?.[scriptName], "string", `Missing script: ${scriptName}`);
});

requiredDocs.forEach((filePath) => {
  assert.equal(existsSync(new URL(`../${filePath}`, import.meta.url)), true, `${filePath} should exist`);
});

requiredEnvTemplates.forEach((filePath) => {
  assert.equal(existsSync(new URL(`../${filePath}`, import.meta.url)), true, `${filePath} should exist`);
});

console.log("Repository smoke checks passed.");
