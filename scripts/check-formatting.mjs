import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

const rootDir = process.cwd();
const targetExtensions = new Set([".json", ".md", ".mjs", ".prisma", ".ts", ".tsx"]);
const ignoredDirectories = new Set([".git", ".next", "dist", "node_modules"]);
const errors = [];
let checkedFiles = 0;

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        walk(join(directory, entry.name));
      }
      continue;
    }

    const extension = extname(entry.name);
    if (!targetExtensions.has(extension)) {
      continue;
    }

    const filePath = join(directory, entry.name);
    const text = readFileSync(filePath, "utf8");
    checkedFiles += 1;

    if (text.includes("\uFFFD")) {
      errors.push(`${filePath}: contains invalid UTF-8 replacement characters`);
    }

    if (!text.endsWith("\n")) {
      errors.push(`${filePath}: missing trailing newline`);
    }

    const lines = text.split(/\r?\n/);
    const contentLines = text.endsWith("\n") ? lines.slice(0, -1) : lines;

    if (extension === ".md") {
      continue;
    }

    contentLines.forEach((line, index) => {
      if (/\s+$/.test(line)) {
        errors.push(`${filePath}:${index + 1}: trailing whitespace`);
      }
    });
  }
}

walk(rootDir);

if (errors.length > 0) {
  console.error("Formatting check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Formatting check passed for ${checkedFiles} files.`);
