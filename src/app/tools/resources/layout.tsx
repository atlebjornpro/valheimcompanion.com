import type { ReactNode } from "react";
import { createPageMetadata } from "../../../config/metadata";

export const metadata = createPageMetadata({
  title: "Enshrouded Resource Finder",
  description:
    "Find important Enshrouded materials by name, Embervale region, source, and crafting use.",
  path: "/tools/resources",
});

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
