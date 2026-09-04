import fs from "node:fs";
import path from "node:path";

const contentRoot = path.join(process.cwd(), "content");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : target;
  });
}

const contentFiles = walk(contentRoot).filter((file) => file.endsWith(".mdx"));
const validRoutes = new Set([
  "/",
  ...contentFiles.map((file) => `/${path.relative(contentRoot, file).replaceAll("\\", "/").replace(/\.mdx$/, "")}`),
]);
const errors = [];

for (const file of contentFiles) {
  const source = fs.readFileSync(file, "utf8");
  const linkPattern = /(?<!!)\[[^\]]*\]\((\/[\w./-]+)(?:[?#][^)]*)?\)/g;

  for (const match of source.matchAll(linkPattern)) {
    const rawTarget = match[1];
    const target = rawTarget.length > 1 ? rawTarget.replace(/\/$/, "") : rawTarget;
    if (!validRoutes.has(target)) {
      const line = source.slice(0, match.index).split("\n").length;
      errors.push(`${path.relative(process.cwd(), file)}:${line} -> ${rawTarget}`);
    }
  }
}

if (errors.length) {
  console.error("Broken internal content links:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Checked internal links across ${contentFiles.length} content pages.`);
