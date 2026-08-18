import type { Metadata } from "next";
import { site } from "./site";

export const SITE_NAME = site.name;
export const SITE_URL = site.url;
export const DEFAULT_DESCRIPTION = site.description;

export function createPageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: "/og.jpg", width: 1731, height: 909, alt: `${SITE_NAME}: ${title}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  };
}
