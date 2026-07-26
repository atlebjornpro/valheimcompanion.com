"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const resources = [
  ["Flintstone", "Springlands", "Mine pale stone deposits and exposed veins.", "Early tools, building, and crafting"],
  ["Salt", "Springlands", "Mine salt deposits in the Egerton Salt Mines and Shroud caves.", "Dried food, leather, and recipes"],
  ["Metal Scraps", "Springlands", "Loot Scavengers and dismantle metal objects.", "Early metalworking and tools"],
  ["Shroud Wood", "Springlands", "Cut corrupted trees inside the Shroud.", "Early crafting and Flame upgrades"],
  ["Shroud Liquid", "Springlands", "Harvest mushrooms and plants inside Shrouded areas.", "Flame level 2 and alchemy"],
  ["Copper Ore", "Revelwood", "Mine orange-brown veins in Revelwood deposits.", "Copper bars and bronze progression"],
  ["Clay", "Revelwood", "Mine reddish clay terrain with a pickaxe.", "Bricks, kilns, and building"],
  ["Hardwood", "Revelwood", "Fell large trees in the Revelwood.", "Carpenter progression and gear"],
  ["Amber", "Revelwood", "Mine glowing amber deposits, often in Shrouded rock.", "Flame level 4 and mage crafting"],
  ["Tin Ore", "Nomad Highlands", "Mine dark tin veins in highland deposits.", "Combine with copper for bronze"],
  ["Limestone", "Nomad Highlands", "Mine pale limestone cliffs and deposits.", "Building and advanced crafting"],
  ["Fossilized Bone", "Nomad Highlands", "Mine fossil deposits embedded in terrain.", "Flame level 5 and bone materials"],
  ["Sulfur", "Nomad Highlands / Kindlewastes", "Mine yellow sulfur deposits.", "Explosives, alchemy, and ammunition"],
  ["Iron Ore", "Kindlewastes", "Mine iron veins in Shroud mines such as Ridgeback Mine.", "Iron and steel bars"],
  ["Sand", "Kindlewastes", "Dig desert terrain with a pickaxe.", "Glass, mortar, and building"],
  ["Saffron", "Kindlewastes", "Harvest the red flowering plant in the desert.", "Flame level 6, food, and dyes"],
  ["Lapislazuli", "Kindlewastes", "Mine blue mineral deposits in the desert region.", "Flame level 6 and crafting"],
  ["Obsidian", "Albaneve Summits", "Mine black volcanic-glass veins in the mountains.", "High-tier gear, arrows, and Flame level 8"],
  ["Silver Ore", "Albaneve Summits", "Mine silver-bearing veins in mountain deposits.", "Silver bars and high-tier recipes"],
  ["Amethyst", "Albaneve Summits", "Mine purple crystal deposits.", "Flame level 8 and advanced gear"],
  ["Granite", "Albaneve Summits", "Mine dark mountain stone.", "Flame level 7 and building"],
  ["Gentian", "Albaneve Summits", "Harvest alpine blue flowers.", "Flame level 7 and consumables"],
  ["Wool", "Albaneve Summits", "Gather from tamed or wild wool-producing animals.", "Warm textiles and Flame level 7"],
  ["Gold Ore", "Veilwater Basin", "Mine gold-bearing veins in late-game deposits.", "Gold bars and Flame level 9"],
  ["Aquamarine", "Veilwater Basin", "Mine blue-green crystal deposits.", "Flame level 9 and advanced crafting"],
  ["Pearl", "Veilwater Basin", "Gather from aquatic sources and fishing progression.", "Flame level 9 and diving gear"],
  ["Tropical Wood", "Veilwater Basin", "Fell tropical trees in the basin.", "Late-game building and crafting"],
  ["Bamboo Logs", "Veilwater Basin", "Cut bamboo stands.", "Building blocks, rods, and decorations"],
  ["Shroud Spores", "All Shrouded regions", "Defeat Fell enemies.", "Grappling Hook, alchemy, and early quests"],
  ["Runes", "All regions", "Salvage equipment and collect rune rewards.", "Equipment upgrades and skill respecs"],
] as const;

const regions = ["All", ...Array.from(new Set(resources.map((item) => item[1])))];

export default function ResourceFinderPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter(([name, location, source, use]) =>
      (region === "All" || location === region) &&
      (!needle || [name, location, source, use].some((value) => value.toLowerCase().includes(needle))),
    );
  }, [query, region]);

  return (
    <div className="mx-auto max-w-5xl py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Searchable tool</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Resource Finder</h1>
      <p className="mt-4 max-w-3xl leading-7 text-stone-400">A fast index of progression-critical materials, where they come from, and why you need them.</p>

      <div className="mt-8 grid gap-3 rounded-2xl border border-stone-800 bg-stone-900/50 p-4 sm:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
          <span className="sr-only">Search resources</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ore, use, or source…" className="w-full rounded-xl border border-stone-700 bg-stone-950 py-2.5 pl-10 pr-3 text-sm text-stone-100 outline-none focus:border-amber-400/60" />
        </label>
        <label>
          <span className="sr-only">Filter by region</span>
          <select value={region} onChange={(event) => setRegion(event.target.value)} className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-400/60">
            {regions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-800">
        <div className="hidden grid-cols-[1fr_1.2fr_2fr_1.5fr] gap-4 bg-stone-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-stone-500 md:grid">
          <span>Resource</span><span>Region</span><span>Where to get it</span><span>Used for</span>
        </div>
        {filtered.map(([name, location, source, use]) => (
          <article key={name} className="grid gap-3 border-t border-stone-800 bg-stone-950/40 px-5 py-5 first:border-t-0 md:grid-cols-[1fr_1.2fr_2fr_1.5fr] md:items-start">
            <h2 className="font-bold text-amber-200">{name}</h2>
            <p className="text-sm text-stone-300">{location}</p>
            <p className="text-sm leading-6 text-stone-400">{source}</p>
            <p className="text-sm leading-6 text-stone-400">{use}</p>
          </article>
        ))}
        {filtered.length === 0 && <p className="bg-stone-950/40 px-5 py-12 text-center text-sm text-stone-500">No matching resource found.</p>}
      </div>
      <p className="mt-4 text-xs text-stone-500">{filtered.length} of {resources.length} resources shown · Reviewed for v0.9.1.2.</p>
    </div>
  );
}
