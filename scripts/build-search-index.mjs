import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

async function getFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const target = path.resolve(directory, entry.name);
    return entry.isDirectory() ? getFiles(target) : target;
  }))).flat();
}

const contentRoot = path.join(process.cwd(), 'content');
const index = [];

for (const file of await getFiles(contentRoot)) {
  if (!file.endsWith('.mdx')) continue;
  const { data } = matter(await fs.readFile(file, 'utf8'));
  index.push({
    slug: '/' + path.relative(contentRoot, file).replace(/\\/g, '/').replace(/\.mdx$/, ''),
    title: data.title || 'Untitled',
    description: data.description || '',
  });
}

index.sort((a, b) => a.title.localeCompare(b.title));
await fs.writeFile(path.join(process.cwd(), 'public', 'search-index.json'), JSON.stringify(index, null, 2));
console.log(`Generated search index with ${index.length} entries.`);
