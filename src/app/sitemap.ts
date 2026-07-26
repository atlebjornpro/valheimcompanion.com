import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";

const siteUrl = "https://www.enshroudedcompanion.com";

const staticRoutes = [
  "/",
  "/checklist",
  "/faq",
  "/tools/flame-planner",
  "/tools/resources",
  "/tools/rested",
  "/tools/skill-points",
  "/world/regions",
];

function getContentRoutes(directory: string, contentRoot = directory): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getContentRoutes(fullPath, contentRoot);
    }

    if (!entry.name.endsWith(".mdx")) return [];

    const relativePath = path.relative(contentRoot, fullPath);
    return [`/${relativePath.replace(/\\/g, "/").replace(/\.mdx$/, "")}`];
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentRoutes = getContentRoutes(path.join(process.cwd(), "content"));
  const routes = Array.from(new Set([...staticRoutes, ...contentRoutes])).sort();

  return routes.map((route) => ({
    url: route === "/" ? siteUrl : `${siteUrl}${route}`,
    lastModified: new Date("2026-07-26"),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/tools/") ? 0.8 : 0.7,
  }));
}
