"use client";

import { useState } from "react";
import { Armchair, BatteryCharging, Timer } from "lucide-react";

export default function RestedCalculatorPage() {
  const [level, setLevel] = useState(1);
  const [comfort, setComfort] = useState(5);
  const bonusStamina = 40 + Math.floor(level / 2) * 8;
  const staminaRegen = level * 4;

  return (
    <div className="mx-auto max-w-4xl py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Base & stamina tool</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Rested Calculator</h1>
      <p className="mt-4 max-w-3xl leading-7 text-stone-400">See the Rested buff&apos;s level-scaled stamina values and use Comfort as a planning target for your base.</p>

      <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-900/45 p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Range label="Character level" value={level} min={1} max={45} onChange={setLevel} />
          <Range label="Comfort level" value={comfort} min={1} max={100} onChange={setComfort} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Metric icon={BatteryCharging} label="Bonus stamina" value={`+${bonusStamina}`} />
        <Metric icon={Timer} label="Stamina regeneration" value={`+${staminaRegen}`} />
        <Metric icon={Armchair} label="Comfort target" value={String(comfort)} />
      </div>

      <section className="mt-6 rounded-2xl border border-stone-800 bg-stone-950/40 p-6">
        <h2 className="text-lg font-bold text-stone-100">How to read this</h2>
        <p className="mt-3 text-sm leading-6 text-stone-400">
          Character level controls the strength of the Rested buff. Comfort controls how long the buff lasts,
          but current public data does not establish a single reliable duration formula across all items and world settings,
          so this tool avoids inventing an exact timer.
        </p>
        <p className="mt-3 text-sm leading-6 text-stone-400">
          To activate Rested, be safe, sheltered, warm, and sitting or sleeping near at least one comfort source.
        </p>
      </section>
      <p className="mt-5 text-xs text-stone-500">Formula reviewed against the official wiki&apos;s v0.9 Rested values on July 26, 2026.</p>
    </div>
  );
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label><span className="mb-3 flex justify-between text-sm font-medium text-stone-300"><span>{label}</span><strong className="text-amber-300">{value}</strong></span><input className="w-full accent-amber-400" type="range" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Timer; label: string; value: string }) {
  return <div className="rounded-2xl border border-amber-400/15 bg-amber-500/5 p-5"><Icon className="h-5 w-5 text-amber-400" /><div className="mt-4 text-3xl font-black text-stone-100">{value}</div><div className="mt-1 text-xs uppercase tracking-wider text-stone-500">{label}</div></div>;
}
