import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

const rootDir = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "dist", "node_modules"]);
const markdownFiles = [];
const errors = [];

function collectMarkdownFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        collectMarkdownFiles(join(directory, entry.name));
      }
      continue;
    }

    if (extname(entry.name) === ".md") {
      markdownFiles.push(join(directory, entry.name));
    }
  }
}

collectMarkdownFiles(rootDir);

for (const filePath of markdownFiles) {
  const text = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const headingMatches = [...text.matchAll(/^(#+)\s+(.+)$/gm)];

  if (headingMatches.length === 0) {
    errors.push(`${filePath}: missing markdown headings`);
    continue;
  }

  if (headingMatches[0][1].length !== 1) {
    errors.push(`${filePath}: first heading must start at level 1`);
  }

  let previousLevel = 0;

  headingMatches.forEach((match) => {
    const level = match[1].length;
    if (previousLevel > 0 && level - previousLevel > 1) {
      errors.push(`${filePath}: heading level jumps from H${previousLevel} to H${level}`);
    }
    previousLevel = level;
  });
}

if (errors.length > 0) {
  console.error("Markdown structure check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Markdown structure check passed for ${markdownFiles.length} files.`);
