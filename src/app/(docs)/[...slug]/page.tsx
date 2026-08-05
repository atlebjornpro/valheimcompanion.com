import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { AnchorHTMLAttributes } from "react";
import { createPageMetadata, SITE_NAME, SITE_URL } from "../../../config/metadata";

type RouteParams = { slug?: string[] };
type Doc = { content: string; frontmatter: { title: string; description: string; updated?: string } };

async function getContentFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? getContentFiles(target) : target;
  }))).flat();
}

export async function generateStaticParams() {
  const contentRoot = path.join(process.cwd(), "content");
  return (await getContentFiles(contentRoot))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: path.relative(contentRoot, file).replace(/\\/g, "/").replace(/\.mdx$/, "").split("/") }));
}

async function getDoc(slugParts: string[]): Promise<Doc | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "content", slugParts.join("/") + ".mdx"), "utf8");
    const { content, data } = matter(raw);
    return { content, frontmatter: { title: String(data.title ?? "Untitled"), description: String(data.description ?? ""), updated: data.updated ? String(data.updated) : undefined } };
  } catch { return null; }
}

function MdxLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = typeof props.href === "string" && /^https?:\/\//.test(props.href);
  return <a {...props} rel={external ? "noopener" : props.rel} target={external ? "_blank" : props.target} />;
}

const relatedMap: Record<string, { href: string; label: string }[]> = {
  "/valheim-1-0": [{ href: "/deep-north", label: "Deep North coverage" }, { href: "/servers/existing-world-vs-new-world", label: "Existing or new world?" }, { href: "/updates", label: "Update coverage" }],
  "/deep-north": [{ href: "/valheim-1-0", label: "Valheim 1.0 release hub" }, { href: "/servers/existing-world-vs-new-world", label: "Existing or new world?" }, { href: "/servers/world-backup-restore", label: "Back up a world" }],
  "/servers": [{ href: "/servers/dedicated-server-setup", label: "Dedicated server setup" }, { href: "/servers/crossplay", label: "Crossplay configuration" }, { href: "/servers/world-backup-restore", label: "Backup and restore" }],
  "/servers/dedicated-server-setup": [{ href: "/servers/server-settings", label: "Server settings" }, { href: "/servers/crossplay", label: "Crossplay configuration" }, { href: "/servers/server-not-showing", label: "Server not showing" }],
  "/servers/crossplay": [{ href: "/servers/dedicated-server-setup", label: "Server setup" }, { href: "/servers/server-not-showing", label: "Connection troubleshooting" }],
  "/servers/existing-world-vs-new-world": [{ href: "/valheim-1-0", label: "Valheim 1.0 release hub" }, { href: "/deep-north", label: "Deep North preparation" }, { href: "/servers/world-backup-restore", label: "Back up and restore a world" }],
  "/servers/world-backup-restore": [{ href: "/servers/move-local-world-to-server", label: "Move a local world" }, { href: "/servers/updating-a-server", label: "Updating a server" }],
};

const legalRoutes = new Set(["/about", "/contact", "/data-sources", "/editorial-policy", "/privacy", "/terms"]);

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { slug = [] } = await params;
  const doc = await getDoc(slug);
  return doc ? createPageMetadata({ title: doc.frontmatter.title, description: doc.frontmatter.description, path: `/${slug.join("/")}` }) : {};
}

export default async function DocPage({ params }: { params: Promise<RouteParams> }) {
  const { slug = [] } = await params;
  if (!slug.length || slug[0] === ".well-known") return notFound();
  const doc = await getDoc(slug);
  if (!doc) return notFound();

  const route = `/${slug.join("/")}`;
  const canonical = `${SITE_URL}${route}`;
  const updated = doc.frontmatter.updated && !Number.isNaN(new Date(doc.frontmatter.updated).getTime()) ? new Date(doc.frontmatter.updated).toISOString() : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": legalRoutes.has(route) ? "WebPage" : "Article",
    headline: doc.frontmatter.title,
    description: doc.frontmatter.description,
    dateModified: updated,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: canonical,
    url: canonical,
  };
  const related = relatedMap[route] ?? [];

  return <article className="prose prose-neutral dark:prose-invert max-w-3xl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header className="not-prose mb-8 border-b border-[#393126] pb-7">
      <p className="section-kicker">{legalRoutes.has(route) ? "Site information" : "Source-reviewed guide"}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-[#eee4d1]">{doc.frontmatter.title}</h1>
      {doc.frontmatter.description ? <p className="mt-4 max-w-2xl leading-7 text-[#aaa18f]">{doc.frontmatter.description}</p> : null}
      {updated ? <p className="mt-4 text-xs uppercase tracking-wider text-[#756f63]">Reviewed {updated.slice(0, 10)}</p> : null}
    </header>
    <MDXRemote source={doc.content} components={{ a: MdxLink }} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings] } }} />
    {related.length ? <section className="not-prose mt-10 border-t border-[#393126] pt-6"><h2 className="text-sm font-bold uppercase tracking-wider text-[#8db6ba]">Related coverage</h2><ul className="mt-4 grid gap-2">{related.map((item) => <li key={item.href}><Link href={item.href} className="text-[#e1ad5a] hover:text-[#f0bd68]">{item.label} →</Link></li>)}</ul></section> : null}
  </article>;
}
