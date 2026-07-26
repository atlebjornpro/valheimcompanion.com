import type { ReactNode } from "react";
import { createPageMetadata } from "../../../config/metadata";

export const metadata = createPageMetadata({
  title: "Enshrouded Rested Calculator",
  description:
    "Estimate Enshrouded Rested stamina benefits and use Comfort as a practical planning target for your base.",
  path: "/tools/rested",
});

export default function RestedLayout({ children }: { children: ReactNode }) {
  return children;
}
