import fs from "node:fs/promises";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

async function contentFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = (await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? contentFiles(target) : [target];
  }))).flat();
  return files.filter((file) => file.endsWith(".mdx"));
}

const root = path.join(process.cwd(), "content");
const files = await contentFiles(root);
const errors = [];

for (const file of files) {
  try {
    await compile(await fs.readFile(file, "utf8"), { remarkPlugins: [remarkGfm] });
  } catch (error) {
    errors.push(`${path.relative(process.cwd(), file)}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Compiled ${files.length} MDX files.`);
}
