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

type RouteParams = { slug?: string[] };

type Doc = {
  content: string;
  frontmatter: {
    title: string;
    description: string;
    updated?: string;
  };
};

async function getDoc(slugParts: string[]): Promise<Doc | null> {
  const relPath = slugParts.join("/") + ".mdx";
  const fullPath = path.join(process.cwd(), "content", relPath);

  try {
    const raw = await fs.readFile(fullPath, "utf8");
    const { content, data } = matter(raw);

    return {
      content,
      frontmatter: {
        title: (data.title as string) ?? "Untitled",
        description: (data.description as string) ?? "",
        updated: (data.updated as string) ?? undefined,
      },
    };
  } catch {
    return null;
  }
}

function formatUpdated(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getRelated(slugParts: string[]) {
  const slug = "/" + slugParts.join("/");

  const relatedMap: Record<string, { href: string; label: string }[]> = {
    "/getting-started": [
      { href: "/world/regions", label: "Regions of Embervale" },
      { href: "/tools/flame-planner", label: "Flame upgrade planner" },
    ],
    "/building/comfort": [
      { href: "/tools/rested", label: "Rested calculator" },
      { href: "/building/base-planning", label: "Base planning" },
    ],
    "/guides/best-gear-for-enshrouded": [
      { href: "/guides/best-router-for-enshrouded-self-hosting", label: "Best router for self-hosting" },
      { href: "/guides/server-hosting", label: "Managed server hosting" },
    ],
    "/guides/best-router-for-enshrouded-self-hosting": [
      { href: "/guides/server-hosting", label: "Managed server hosting" },
      { href: "/guides/best-gear-for-enshrouded", label: "Best gear for Enshrouded" },
    ],
  };

  return relatedMap[slug] ?? [];
}

function MdxLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const affiliateHosts = [
    "amzn.to",
    "shockbyte.com",
    "nitrado-aff.com",
    "supercraft.host",
  ];
  const isAffiliate =
    typeof props.href === "string" &&
    affiliateHosts.some((host) => {
      try {
        return new URL(props.href as string).hostname.endsWith(host);
      } catch {
        return false;
      }
    });

  return (
    <a
      {...props}
      rel={isAffiliate ? "sponsored nofollow noopener" : props.rel}
      target={isAffiliate ? "_blank" : props.target}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const slugParts = slug ?? [];

  if (slugParts[0] === ".well-known") return {};

  const doc = await getDoc(slugParts);
  if (!doc) return {};

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const slugParts = slug ?? [];

  if (slugParts.length === 0) return notFound();
  if (slugParts[0] === ".well-known") return notFound();

  const doc = await getDoc(slugParts);
  if (!doc) return notFound();

  const updated = formatUpdated(doc.frontmatter.updated);
  const related = getRelated(slugParts);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.frontmatter.title,
    description: doc.frontmatter.description,
    dateModified: updated ? new Date(updated).toISOString() : undefined,
    author: {
      "@type": "Person",
      name: "Enshrouded Companion",
    },
  };

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page header */}
      <header className="not-prose mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{doc.frontmatter.title}</h1>

        {doc.frontmatter.description ? (
          <p className="mt-2 text-base opacity-80">{doc.frontmatter.description}</p>
        ) : null}

        {updated ? (
          <p className="mt-2 text-sm opacity-60">Last updated: {updated}</p>
        ) : null}
      </header>

      {/* MDX body */}
      <MDXRemote
        source={doc.content}
        components={{ a: MdxLink }}
        options={{
          mdxOptions: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            remarkPlugins: [remarkGfm as any],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rehypePlugins: [rehypeSlug as any, rehypeAutolinkHeadings as any],
          },
        }}
      />

      {/* Related links */}
      {related.length > 0 ? (
        <section className="not-prose mt-10 border-t pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">
            Related pages
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="underline underline-offset-4">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
