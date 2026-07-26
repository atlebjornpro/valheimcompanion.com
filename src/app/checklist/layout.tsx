import type { ReactNode } from "react";
import { createPageMetadata } from "../../config/metadata";

export const metadata = createPageMetadata({
  title: "Enshrouded Adventure Checklist",
  description:
    "Track important Enshrouded progression milestones, survivors, regions, crafting unlocks, and Flame upgrades in your browser.",
  path: "/checklist",
});

export default function ChecklistLayout({ children }: { children: ReactNode }) {
  return children;
}
