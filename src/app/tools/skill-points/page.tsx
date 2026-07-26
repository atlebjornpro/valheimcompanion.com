"use client";

import { useState } from "react";
import { Calculator, Info } from "lucide-react";

export default function SkillPointCalculatorPage() {
  const [level, setLevel] = useState(1);
  const [roots, setRoots] = useState(0);
  const [wells, setWells] = useState(0);
  const [spent, setSpent] = useState(0);
  const levelPoints = Math.max(0, level - 1) * 2;
  const worldPoints = roots + wells * 3;
  const earned = Math.min(184, levelPoints + worldPoints);
  const available = Math.max(0, earned - spent);

  return (
    <div className="mx-auto max-w-4xl py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Progression tool</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Skill Point Calculator</h1>
      <p className="mt-4 max-w-3xl leading-7 text-stone-400">Count points from levels, Shroud Roots, and Elixir Wells after the Forging the Path skill-tree rework.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-stone-800 bg-stone-900/45 p-6">
          <h2 className="font-bold text-stone-100">Character progress</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberInput label="Character level" value={level} min={1} max={45} onChange={setLevel} />
            <NumberInput label="Points already spent" value={spent} min={0} max={184} onChange={setSpent} />
            <NumberInput label="Shroud Roots cleared" value={roots} min={0} max={96} onChange={setRoots} />
            <NumberInput label="Elixir Wells cleared" value={wells} min={0} max={32} onChange={setWells} />
          </div>
          <div className="mt-6 flex gap-3 rounded-xl border border-stone-700 bg-stone-950/60 p-4 text-sm leading-6 text-stone-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            Each level gained awards 2 points, a Shroud Root awards 1, and an Elixir Well awards 3. World objectives award points only once per character.
          </div>
        </section>

        <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-stone-950 p-6">
          <Calculator className="h-7 w-7 text-amber-400" />
          <p className="mt-6 text-sm text-stone-400">Available now</p>
          <p className="mt-1 text-5xl font-black text-stone-100">{available}</p>
          <div className="mt-7 space-y-3 border-t border-stone-700/60 pt-5">
            <Result label="From levels" value={levelPoints} />
            <Result label="From world objectives" value={worldPoints} />
            <Result label="Total earned" value={earned} />
            <Result label="Unfound maximum" value={Math.max(0, 184 - earned)} />
          </div>
        </section>
      </div>
      <p className="mt-5 text-xs text-stone-500">Current v0.9 maximum: level 45 and 184 spendable points. Objective counters are intentionally manual so the calculator works with any world state.</p>
    </div>
  );
}

function NumberInput({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-stone-300">{label}</span><input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Math.min(max, Math.max(min, Number(event.target.value) || min)))} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 outline-none focus:border-amber-400/60" /></label>;
}

function Result({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between text-sm"><span className="text-stone-400">{label}</span><span className="font-bold text-stone-100">{value}</span></div>;
}
