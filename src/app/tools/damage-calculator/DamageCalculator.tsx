"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Calculator, Copy, RotateCcw, Scale, Swords } from "lucide-react";
import {
  attributeName,
  calculateDamage,
  DamageLoadout,
  loadoutA,
  loadoutB,
  serializeLoadout,
} from "./damage-model";

type Props = { initialA: DamageLoadout; initialB: DamageLoadout };

export default function DamageCalculatorTool({ initialA, initialB }: Props) {
  const [first, setFirst] = useState(initialA);
  const [second, setSecond] = useState(initialB);
  const [copied, setCopied] = useState(false);
  const resultA = useMemo(() => calculateDamage(first), [first]);
  const resultB = useMemo(() => calculateDamage(second), [second]);
  const dpsDifference = resultA.estimatedDps - resultB.estimatedDps;
  const winner = Math.abs(dpsDifference) < 0.01 ? "Tie" : dpsDifference > 0 ? "Loadout A" : "Loadout B";

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams({ a: serializeLoadout(first), b: serializeLoadout(second) }).toString();
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto max-w-6xl py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Combat comparison tool</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Enshrouded Damage Calculator</h1>
      <p className="mt-4 max-w-4xl leading-7 text-stone-400">
        Estimate pre-defense hit damage and DPS, compare two weapons or builds, and see how much the next main-attribute point contributes. Results use visible player stats and your chosen multipliers.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={copyLink} className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-bold text-amber-200 hover:bg-amber-400/15">
          <Copy className="h-4 w-4" /> {copied ? "Link copied" : "Copy comparison link"}
        </button>
        <button onClick={() => { setFirst(loadoutA); setSecond(loadoutB); }} className="inline-flex items-center gap-2 rounded-xl border border-stone-700 px-4 py-2.5 text-sm font-bold text-stone-300 hover:border-stone-500 hover:bg-stone-900">
          <RotateCcw className="h-4 w-4" /> Reset examples
        </button>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <LoadoutEditor label="Loadout A" value={first} onChange={setFirst} accent="amber" />
        <LoadoutEditor label="Loadout B" value={second} onChange={setSecond} accent="blue" />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950/45">
        <div className="flex flex-col gap-3 border-b border-stone-800 bg-stone-900/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Estimated winner</p>
            <h2 className="mt-1 text-2xl font-black text-stone-100">{winner}</h2>
          </div>
          {winner !== "Tie" && <p className="text-sm text-stone-400">{format(Math.abs(dpsDifference))} estimated DPS ahead</p>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr><th className="px-5 py-3 font-medium">Result</th><th className="px-5 py-3 font-medium">Loadout A</th><th className="px-5 py-3 font-medium">Loadout B</th><th className="px-5 py-3 font-medium">Difference</th></tr>
            </thead>
            <tbody>
              <ComparisonRow label="Regular hit" a={resultA.regularHit} b={resultB.regularHit} />
              <ComparisonRow label="Critical hit" a={resultA.criticalHit} b={resultB.criticalHit} />
              <ComparisonRow label="Expected average hit" a={resultA.averageHit} b={resultB.averageHit} />
              <ComparisonRow label="Estimated DPS" a={resultA.estimatedDps} b={resultB.estimatedDps} emphasized />
              <ComparisonRow label="DPS from next attribute" a={resultA.nextAttributeDpsGain} b={resultB.nextAttributeDpsGain} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        <InfoCard icon={Calculator} title="Formula used">
          Weapon damage × additive damage bonuses × weak-point multiplier × action multiplier × optional target modifier. Expected DPS also weights critical chance and divides by seconds per attack.
        </InfoCard>
        <InfoCard icon={Scale} title="What is additive">
          The estimator adds 5% per applicable Strength, Dexterity, or Intelligence point to the manually entered skill and equipment bonus. The game&apos;s complete internal stacking order is not public.
        </InfoCard>
        <InfoCard icon={Swords} title="Enemy defenses">
          Armor and hidden enemy-specific resistance multipliers are not automatically applied. Leave Target modifier at 100% for a pre-defense comparison, or enter a multiplier you have verified in game.
        </InfoCard>
      </section>

      <section className="mt-12 border-t border-stone-800 pt-10">
        <h2 className="text-2xl font-black text-stone-100">How to compare Enshrouded weapons</h2>
        <ol className="mt-5 grid gap-3 text-sm leading-6 text-stone-400 md:grid-cols-2">
          <li className="rounded-xl border border-stone-800 bg-stone-900/35 p-4"><strong className="text-stone-200">1. Match the character.</strong> Select the weapon style and enter the complete Strength, Dexterity, or Intelligence shown by the build.</li>
          <li className="rounded-xl border border-stone-800 bg-stone-900/35 p-4"><strong className="text-stone-200">2. Enter visible damage.</strong> Use the weapon&apos;s displayed damage after applying its current upgrades.</li>
          <li className="rounded-xl border border-stone-800 bg-stone-900/35 p-4"><strong className="text-stone-200">3. Add relevant bonuses.</strong> Combine applicable weapon, ranged, melee, magic, or elemental percentage bonuses without including the main attribute twice.</li>
          <li className="rounded-xl border border-stone-800 bg-stone-900/35 p-4"><strong className="text-stone-200">4. Measure attack speed.</strong> Enter seconds between repeatable attacks, including bow draw time or a practical casting cadence.</li>
          <li className="rounded-xl border border-stone-800 bg-stone-900/35 p-4"><strong className="text-stone-200">5. Model the attack.</strong> Normal attacks use 100%; current melee heavy attacks can be compared at 200% before defenses.</li>
          <li className="rounded-xl border border-stone-800 bg-stone-900/35 p-4"><strong className="text-stone-200">6. Compare like with like.</strong> Use the same weak-point and target modifiers in both columns unless the weapons genuinely interact with the target differently.</li>
        </ol>
      </section>

      <section className="mt-10 rounded-2xl border border-amber-400/15 bg-amber-500/5 p-6">
        <h2 className="text-xl font-bold text-stone-100">Accuracy and current version</h2>
        <p className="mt-3 leading-7 text-stone-400">
          This is a transparent build-comparison estimator for Enshrouded v0.9.1.2, not a claim to reproduce the engine exactly. Enemy vulnerabilities and resistances use hidden multipliers that vary by enemy and damage type, while the complete armor curve is not publicly documented. Use the same assumptions for both loadouts and treat the relative comparison as more reliable than an exact health-bar prediction.
        </p>
        <p className="mt-4 text-sm text-stone-400">
          Continue with the <Link href="/guides/builds" className="text-amber-300 underline underline-offset-4">best builds guide</Link> or <Link href="/guides/bosses" className="text-amber-300 underline underline-offset-4">boss strategies</Link>. Formula references: <a href="https://enshrouded.wiki.gg/wiki/Attributes" className="text-amber-300 underline underline-offset-4">attributes</a>, <a href="https://enshrouded.wiki.gg/wiki/Combat_Mechanics" className="text-amber-300 underline underline-offset-4">enemy resistances</a>, and the <a href="https://enshrouded.com/en-US/news/update-8-forging-the-path-combat-changes" className="text-amber-300 underline underline-offset-4">Forging the Path combat update</a>.
        </p>
      </section>
    </div>
  );
}

function LoadoutEditor({ label, value, onChange, accent }: { label: string; value: DamageLoadout; onChange: (value: DamageLoadout) => void; accent: "amber" | "blue" }) {
  const update = <K extends keyof DamageLoadout>(key: K, next: DamageLoadout[K]) => onChange({ ...value, [key]: next });
  const labelColor = accent === "amber" ? "text-amber-300" : "text-blue-300";
  const attribute = attributeName(value.style);
  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/45 p-6">
      <div className="flex items-center justify-between gap-3"><h2 className={`text-xl font-black ${labelColor}`}>{label}</h2><span className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-400">{attribute} scaling</span></div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm font-medium text-stone-300">Weapon style</span><select value={value.style} onChange={(event) => update("style", event.target.value as DamageLoadout["style"])} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-400/60"><option value="melee">Melee — Strength</option><option value="ranged">Bow or dagger — Dexterity</option><option value="magic">Wand or staff — Intelligence</option></select></label>
        <NumberField label="Displayed weapon damage" value={value.weaponDamage} min={0} max={10000} step={1} onChange={(next) => update("weaponDamage", next)} />
        <NumberField label={`${attribute} points`} value={value.attribute} min={0} max={100} step={1} onChange={(next) => update("attribute", next)} help="Adds 5% applicable damage per point." />
        <NumberField label="Other damage bonuses (%)" value={value.otherBonus} min={-100} max={1000} step={1} onChange={(next) => update("otherBonus", next)} help="Skills, gear and applicable elemental bonuses." />
        <NumberField label="Critical chance (%)" value={value.critChance} min={0} max={100} step={1} onChange={(next) => update("critChance", next)} />
        <NumberField label="Critical multiplier (%)" value={value.critMultiplier} min={0} max={1000} step={5} onChange={(next) => update("critMultiplier", next)} help="150% means a critical hit deals 1.5× damage." />
        <NumberField label="Weak-point multiplier (%)" value={value.weakPointMultiplier} min={0} max={1000} step={5} onChange={(next) => update("weakPointMultiplier", next)} help="Use 100% when no weak point is involved." />
        <NumberField label="Seconds per attack" value={value.attackSeconds} min={0.05} max={60} step={0.05} onChange={(next) => update("attackSeconds", next)} help="Use a repeatable real combat cadence." />
        <div>
          <NumberField label="Attack multiplier (%)" value={value.actionMultiplier} min={0} max={1000} step={5} onChange={(next) => update("actionMultiplier", next)} />
          <div className="mt-2 flex gap-2"><PresetButton active={value.actionMultiplier === 100} onClick={() => update("actionMultiplier", 100)}>Normal 100%</PresetButton><PresetButton active={value.actionMultiplier === 200} onClick={() => update("actionMultiplier", 200)}>Heavy 200%</PresetButton></div>
        </div>
        <NumberField label="Target modifier (%)" value={value.targetMultiplier} min={0} max={1000} step={5} onChange={(next) => update("targetMultiplier", next)} help="Optional manual value; 100% excludes defenses." />
      </div>
    </section>
  );
}

function NumberField({ label, value, min, max, step, onChange, help }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; help?: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-stone-300">{label}</span><input type="number" value={value} min={min} max={max} step={step} onChange={(event) => { const parsed = Number(event.target.value); onChange(Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : min); }} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-400/60" />{help && <span className="mt-1.5 block text-xs leading-5 text-stone-500">{help}</span>}</label>;
}

function PresetButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`rounded-lg border px-2.5 py-1.5 text-xs ${active ? "border-amber-400/50 bg-amber-400/10 text-amber-200" : "border-stone-700 text-stone-500 hover:text-stone-300"}`}>{children}</button>;
}

function ComparisonRow({ label, a, b, emphasized = false }: { label: string; a: number; b: number; emphasized?: boolean }) {
  const difference = a - b;
  return <tr className={`border-t border-stone-800 ${emphasized ? "bg-amber-500/5" : ""}`}><th className={`px-5 py-4 ${emphasized ? "text-amber-200" : "font-medium text-stone-300"}`}>{label}</th><td className="px-5 py-4 font-bold text-stone-100">{format(a)}</td><td className="px-5 py-4 font-bold text-stone-100">{format(b)}</td><td className={`px-5 py-4 font-medium ${difference > 0 ? "text-amber-300" : difference < 0 ? "text-blue-300" : "text-stone-500"}`}>{difference > 0 ? "+" : ""}{format(difference)}</td></tr>;
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof Calculator; title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-stone-800 bg-stone-900/35 p-5"><Icon className="h-5 w-5 text-amber-400" /><h2 className="mt-4 font-bold text-stone-100">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-400">{children}</p></div>;
}

function format(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}
