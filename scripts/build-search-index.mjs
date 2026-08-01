import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files).flat();
}

async function buildSearchIndex() {
  const contentDir = path.join(process.cwd(), 'content');
  const files = await getFiles(contentDir);
  const index = [
    { slug: '/tools/damage-calculator', title: 'Enshrouded Damage Calculator', description: 'Estimate hit damage and DPS, compare two weapons or builds, and measure critical-hit or attribute changes.' },
    { slug: '/tools/flame-planner', title: 'Flame Upgrade Planner', description: 'Plan every current Flame upgrade and track its required materials.' },
    { slug: '/tools/resources', title: 'Enshrouded Resource Finder', description: 'Search important materials by region, gathering source, and crafting use.' },
    { slug: '/tools/rested', title: 'Rested Calculator', description: 'Estimate level-scaled Rested benefits and plan a Comfort target.' },
    { slug: '/tools/server-config', title: 'Dedicated Server Config Generator', description: 'Generate core Enshrouded dedicated-server settings safely.' },
    { slug: '/tools/skill-points', title: 'Skill Point Calculator', description: 'Calculate points from levels, Shroud Roots, and Elixir Wells.' },
    { slug: '/checklist', title: 'Enshrouded Adventure Checklist', description: 'Track major Survivors, regions, crafting unlocks, and progression milestones.' },
  ];

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const raw = await fs.readFile(file, 'utf8');
    const { data } = matter(raw);

    // Construct slug from file path relative to content dir
    const relPath = path.relative(contentDir, file);
    // Remove .mdx and normalize slashes
    let slug = relPath.replace(/\\/g, '/').replace(/\.mdx$/, '');

    // Handle index or root files if needed, though usually Next.js handles them.
    // For now, assume slug matches file path structure.
    slug = '/' + slug;

    index.push({
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
    });
  }

  const outPath = path.join(process.cwd(), 'public', 'search-index.json');
  await fs.writeFile(outPath, JSON.stringify(index, null, 2));
  console.log(`Generated search index with ${index.length} entries.`);
}

buildSearchIndex();
