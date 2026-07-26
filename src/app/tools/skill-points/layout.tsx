import type { ReactNode } from "react";
import { createPageMetadata } from "../../../config/metadata";

export const metadata = createPageMetadata({
  title: "Enshrouded Skill Point Calculator",
  description:
    "Calculate skill points earned from character levels, Shroud Roots, and Elixir Wells, then compare them with points spent.",
  path: "/tools/skill-points",
});

export default function SkillPointsLayout({ children }: { children: ReactNode }) {
  return children;
}
