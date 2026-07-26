import type { ReactNode } from "react";
import { createPageMetadata } from "../../../config/metadata";

export const metadata = createPageMetadata({
  title: "Enshrouded Flame Upgrade Planner",
  description:
    "Plan every Enshrouded Flame level upgrade and track Sparks, resources, boss heads, altar capacity, and Shroud time.",
  path: "/tools/flame-planner",
});

export default function FlamePlannerLayout({ children }: { children: ReactNode }) {
  return children;
}
