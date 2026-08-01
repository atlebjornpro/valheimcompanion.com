import { createPageMetadata } from "../../../config/metadata";
import DamageCalculatorTool from "./DamageCalculator";
import { loadoutA, loadoutB, parseLoadout } from "./damage-model";

export const metadata = createPageMetadata({
  title: "Enshrouded Damage Calculator and Weapon Comparison",
  description: "Estimate Enshrouded hit damage and DPS, compare two weapons or builds, model critical hits and heavy attacks, and measure attribute gains.",
  path: "/tools/damage-calculator",
});

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function DamageCalculatorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const first = typeof params.a === "string" ? params.a : undefined;
  const second = typeof params.b === "string" ? params.b : undefined;
  return <DamageCalculatorTool initialA={parseLoadout(first, loadoutA)} initialB={parseLoadout(second, loadoutB)} />;
}
