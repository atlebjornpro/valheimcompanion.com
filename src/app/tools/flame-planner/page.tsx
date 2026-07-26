"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Flame, RotateCcw } from "lucide-react";

type FlameLevel = {
  level: number;
  time: number;
  altars: number;
  survivors: number;
  requirements: string[];
};

const levels: FlameLevel[] = [
  { level: 2, time: 6, altars: 4, survivors: 0, requirements: ["1 Spark", "5 Resin", "5 Penny Bun", "5 Bones", "5 Shroud Liquid", "5 Animal Fur"] },
  { level: 3, time: 7, altars: 6, survivors: 2, requirements: ["5 Sparks", "10 Wax", "10 Salt", "10 Shroud Wood", "10 Flintstone", "25 Mycelium", "1 Scavenger Matron Helmet"] },
  { level: 4, time: 8, altars: 7, survivors: 4, requirements: ["10 Sparks", "15 Goo", "15 Corrupted Boar Tusk", "15 Indigo Plant", "15 Amber", "15 Copper Ore", "1 Fell Wispwyvern Head"] },
  { level: 5, time: 9, altars: 8, survivors: 6, requirements: ["20 Sparks", "20 Mint Mushroom Meat", "20 Fossilized Bone", "20 Ammonia Gland", "20 Tin Ore", "20 Rooibos", "1 Fell Monstrosity Head"] },
  { level: 6, time: 10, altars: 9, survivors: 8, requirements: ["40 Sparks", "40 Enshrouded Vulture Talon", "40 Saffron", "40 Iron Ore", "40 Lapislazuli", "40 Brittle Shroud Flakes", "1 Fell Sicklescythe Head"] },
  { level: 7, time: 11, altars: 10, survivors: 10, requirements: ["40 Sparks", "40 Wool", "40 Gentian", "40 Ice", "40 Granite", "40 Flammable Goo", "1 Fell Cyclops Head"] },
  { level: 8, time: 12, altars: 10, survivors: 12, requirements: ["50 Sparks", "50 Obsidian", "50 Silver Bars", "50 Mauveine", "50 Wolfsbane", "50 Amethyst", "1 Fell Dragon Youngling Head"] },
  { level: 9, time: 13, altars: 10, survivors: 14, requirements: ["60 Sparks", "60 Gold Ore", "60 Green Vitriol Dust", "30 Passionflower", "60 Aquamarine", "30 Pearl", "1 Hydrak'Dal Head"] },
];

export default function FlamePlannerPage() {
  const [selected, setSelected] = useState(2);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem("enshrouded-flame-planner") || "{}")); } catch { setChecked({}); }
  }, []);
  const current = levels.find((item) => item.level === selected) ?? levels[0];
  const completed = useMemo(() => current.requirements.filter((item) => checked[`${selected}:${item}`]).length, [checked, current, selected]);

  const toggle = (item: string) => {
    const key = `${selected}:${item}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    localStorage.setItem("enshrouded-flame-planner", JSON.stringify(next));
  };

  return (
    <div className="mx-auto max-w-5xl py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Persistent checklist</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Flame Upgrade Planner</h1>
      <p className="mt-4 max-w-3xl leading-7 text-stone-400">Plan every Strengthen the Flame upgrade. Checked materials are saved only on this device.</p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {levels.map((item) => <button key={item.level} onClick={() => setSelected(item.level)} className={`min-w-14 rounded-xl border px-4 py-3 text-sm font-bold transition ${selected === item.level ? "border-amber-400 bg-amber-400 text-stone-950" : "border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-600"}`}>{item.level}</button>)}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-stone-800 bg-stone-900/45 p-6">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-sm text-stone-500">Strengthen to</p><h2 className="mt-1 flex items-center gap-2 text-2xl font-black text-stone-100"><Flame className="h-6 w-6 text-amber-400" /> Flame level {selected}</h2></div>
            <button onClick={() => { const next = { ...checked }; current.requirements.forEach((item) => delete next[`${selected}:${item}`]); setChecked(next); localStorage.setItem("enshrouded-flame-planner", JSON.stringify(next)); }} className="rounded-lg p-2 text-stone-500 hover:bg-stone-800 hover:text-stone-200" aria-label="Reset this level"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-stone-800"><div className="h-full bg-amber-400 transition-all" style={{ width: `${(completed / current.requirements.length) * 100}%` }} /></div>
          <p className="mt-2 text-xs text-stone-500">{completed} of {current.requirements.length} requirements ready</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {current.requirements.map((item) => {
              const key = `${selected}:${item}`;
              return <button key={item} onClick={() => toggle(item)} className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${checked[key] ? "border-amber-400/30 bg-amber-400/10 text-stone-400 line-through" : "border-stone-800 bg-stone-950/50 text-stone-200 hover:border-stone-600"}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked[key] ? "border-amber-400 bg-amber-400 text-stone-950" : "border-stone-600"}`}>{checked[key] && <Check className="h-3.5 w-3.5" />}</span>{item}</button>;
            })}
          </div>
        </section>
        <aside className="rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/10 to-stone-950 p-6">
          <h2 className="font-bold text-stone-100">Level {selected} benefits</h2>
          <div className="mt-5 space-y-4">
            <Benefit label="Shroud passage" value={String(selected)} />
            <Benefit label="Time in Shroud" value={`${current.time} min`} />
            <Benefit label="Attribute bonus" value={`+${selected - 1}`} />
            <Benefit label="Active Altars" value={String(current.altars)} />
            <Benefit label="Survivors required" value={String(current.survivors)} />
          </div>
          <p className="mt-6 border-t border-stone-700/60 pt-5 text-xs leading-5 text-stone-500">Flame strengthening is global and permanent. Individual Altar area upgrades are a separate system.</p>
        </aside>
      </div>
      <p className="mt-5 text-xs text-stone-500">Requirements reviewed against the official wiki on July 26, 2026 for v0.9.1.2.</p>
    </div>
  );
}

function Benefit({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-sm text-stone-400">{label}</span><strong className="text-sm text-amber-200">{value}</strong></div>;
}
