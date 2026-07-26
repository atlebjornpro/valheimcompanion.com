"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";

type ChecklistItem = { id: string; label: string; group: string; note: string };

const defaultItems: ChecklistItem[] = [
  { id: "altar", label: "Place the first Flame Altar", group: "Foundation", note: "Permanent building and fast travel" },
  { id: "workbench", label: "Craft a Workbench", group: "Foundation", note: "Repairs gear and unlocks core recipes" },
  { id: "grapple", label: "Craft a Grappling Hook", group: "Foundation", note: "Required for many traversal routes" },
  { id: "glider", label: "Craft the first Glider", group: "Foundation", note: "Turns Spires into travel hubs" },
  { id: "blacksmith", label: "Rescue the Blacksmith", group: "Survivors", note: "Melee gear and metalworking" },
  { id: "alchemist", label: "Rescue the Alchemist", group: "Survivors", note: "Magic gear, potions, and powders" },
  { id: "hunter", label: "Rescue the Hunter", group: "Survivors", note: "Ranged gear, leather, and textiles" },
  { id: "carpenter", label: "Rescue the Carpenter", group: "Survivors", note: "Woodworking and construction" },
  { id: "farmer", label: "Rescue the Farmer", group: "Survivors", note: "Food, crops, and animals" },
  { id: "revelwood", label: "Reach Revelwood", group: "World", note: "Recommended around levels 10–15" },
  { id: "highlands", label: "Reach Nomad Highlands", group: "World", note: "Recommended around levels 15–20" },
  { id: "kindlewastes", label: "Reach Kindlewastes", group: "World", note: "Iron-tier progression" },
  { id: "albaneve", label: "Reach Albaneve Summits", group: "World", note: "Prepare frost resistance" },
  { id: "veilwater", label: "Reach Veilwater Basin", group: "World", note: "Current level-45 region" },
  { id: "magic-chest", label: "Unlock Magic Chests", group: "Base", note: "Craft directly from nearby storage" },
  { id: "comfort", label: "Build a reliable Rested room", group: "Base", note: "Shelter, warmth, bed, and comfort" },
  { id: "blast-furnace", label: "Complete the Blast Furnace chain", group: "Base", note: "Efficient iron and steel production" },
];

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem("enshrouded-adventure-checklist") || "{}")); } catch { setChecked({}); }
    setLoaded(true);
  }, []);
  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem("enshrouded-adventure-checklist", JSON.stringify(next));
  };
  const groups = Array.from(new Set(defaultItems.map((item) => item.group)));
  const done = defaultItems.filter((item) => checked[item.id]).length;

  if (!loaded) return <div className="py-12 text-stone-500">Loading checklist…</div>;
  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Saved on this device</p><h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Adventure Checklist</h1><p className="mt-3 text-stone-400">{done} of {defaultItems.length} milestones complete</p></div>
        <button onClick={() => { setChecked({}); localStorage.removeItem("enshrouded-adventure-checklist"); }} className="inline-flex items-center gap-2 self-start rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-300 hover:border-amber-400/40 hover:text-amber-200"><RotateCcw className="h-4 w-4" /> Reset all</button>
      </div>
      <div className="mt-7 h-2 overflow-hidden rounded-full bg-stone-800"><div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all" style={{ width: `${(done / defaultItems.length) * 100}%` }} /></div>
      <div className="mt-8 space-y-8">
        {groups.map((group) => <section key={group}><h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-stone-500">{group}</h2><div className="space-y-2">{defaultItems.filter((item) => item.group === group).map((item) => <button key={item.id} onClick={() => toggle(item.id)} className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${checked[item.id] ? "border-amber-400/20 bg-amber-400/5" : "border-stone-800 bg-stone-900/45 hover:border-stone-600"}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${checked[item.id] ? "border-amber-400 bg-amber-400 text-stone-950" : "border-stone-600"}`}>{checked[item.id] && <Check className="h-4 w-4" />}</span><span className="flex-1"><strong className={`block text-sm ${checked[item.id] ? "text-stone-500 line-through" : "text-stone-100"}`}>{item.label}</strong><span className="mt-1 block text-xs text-stone-500">{item.note}</span></span></button>)}</div></section>)}
      </div>
    </div>
  );
}
