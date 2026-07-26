import type { Metadata } from "next";

export const SITE_NAME = "Enshrouded Companion";
export const SITE_URL = "https://www.enshroudedcompanion.com";
export const DEFAULT_DESCRIPTION =
  "Current Enshrouded progression guides, resource locations, build foundations, and practical planning tools.";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
