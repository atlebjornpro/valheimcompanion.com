import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const siteUrl = "https://www.enshroudedcompanion.com";

const staticRoutes = [
  "/",
  "/checklist",
  "/faq",
  "/tools/damage-calculator",
  "/tools/flame-planner",
  "/tools/resources",
  "/tools/rested",
  "/tools/server-config",
  "/tools/skill-points",
  "/world/regions",
];

type ContentRoute = {
  route: string;
  lastModified: Date;
};

function getContentRoutes(directory: string, contentRoot = directory): ContentRoute[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getContentRoutes(fullPath, contentRoot);
    }

    if (!entry.name.endsWith(".mdx")) return [];

    const relativePath = path.relative(contentRoot, fullPath);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(source);
    const parsedDate = data.updated ? new Date(String(data.updated)) : null;

    return [{
      route: `/${relativePath.replace(/\\/g, "/").replace(/\.mdx$/, "")}`,
      lastModified:
        parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate
          : fs.statSync(fullPath).mtime,
    }];
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentRoutes = getContentRoutes(path.join(process.cwd(), "content"));
  const entries = new Map<string, Date>(
    staticRoutes.map((route) => [route, new Date("2026-08-01")]),
  );

  contentRoutes.forEach(({ route, lastModified }) => {
    entries.set(route, lastModified);
  });

  return Array.from(entries.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([route, lastModified]) => ({
    url: route === "/" ? siteUrl : `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/tools/") ? 0.8 : 0.7,
  }));
}
