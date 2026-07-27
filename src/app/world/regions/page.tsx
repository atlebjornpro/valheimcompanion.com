import { Flame, Mountain, Waves, Wind } from "lucide-react";
import Link from "next/link";
import { createPageMetadata } from "../../../config/metadata";

const regions = [
  {
    name: "Springlands",
    href: "/world/regions/springlands",
    levels: "1–10",
    flame: "1–2",
    tone: "from-emerald-500/20 to-lime-500/5",
    description: "The starting meadows and woods, including the Low Meadows.",
    resources: ["Flintstone", "Salt", "Metal Scraps", "Shroud Wood"],
    preparation: "Rescue the five foundational craftspeople and establish your first production chains.",
  },
  {
    name: "Revelwood",
    href: "/world/regions/revelwood",
    levels: "10–15",
    flame: "3",
    tone: "from-green-600/20 to-teal-500/5",
    description: "Dense forest, the ruined capital at Pikemead's Reach, and the Blackmire.",
    resources: ["Copper Ore", "Clay", "Hardwood", "Amber"],
    preparation: "Expect tougher Fell, Vukah, poisonous plants, and more vertical routes.",
  },
  {
    name: "Nomad Highlands",
    href: "/world/regions/nomad-highlands",
    levels: "15–20",
    flame: "4",
    tone: "from-yellow-600/20 to-stone-500/5",
    description: "Limestone bluffs surrounding the Pillars of Creation and Umber Hollow.",
    resources: ["Tin Ore", "Limestone", "Fossilized Bone", "Sulfur"],
    preparation: "Bronze progression and long glides become central; watch the Shroud-filled valleys.",
  },
  {
    name: "Kindlewastes",
    href: null,
    levels: "20–30",
    flame: "5",
    tone: "from-orange-600/20 to-amber-500/5",
    description: "Desert mesas, Sun Temples, Scavenger settlements, and deep Shroud canyons.",
    resources: ["Iron Ore", "Sand", "Saffron", "Palm Wood"],
    preparation: "Bring strong ranged answers, mining capacity, and inventory space for iron-tier materials.",
  },
  {
    name: "Albaneve Summits",
    href: null,
    levels: "30–40",
    flame: "6–8",
    tone: "from-sky-500/20 to-blue-500/5",
    description: "A frozen mountain biome dominated by Howling Peak.",
    resources: ["Obsidian", "Silver", "Amethyst", "Conifer Logs"],
    preparation: "Frost resistance and warmth are mandatory at high altitude.",
  },
  {
    name: "Veilwater Basin",
    href: null,
    levels: "40–45",
    flame: "8–9",
    tone: "from-cyan-500/20 to-emerald-500/5",
    description: "Tropical jungle, freshwater lakes, limestone arches, and Drak ruins.",
    resources: ["Gold Ore", "Aquamarine", "Pearl", "Tropical Wood"],
    preparation: "Prepare for water traversal, diving, wetness, and level-45 combat.",
  },
];

export const metadata = createPageMetadata({
  title: "Enshrouded Regions of Embervale",
  description: "Current region levels, Flame requirements, hazards, and resources in Enshrouded.",
  path: "/world/regions",
});

export default function RegionsPage() {
  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">World guide</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Regions of Embervale</h1>
        <p className="mt-4 max-w-3xl leading-7 text-stone-400">
          Follow the world roughly from southwest to northeast. Region levels are a planning guide,
          while Flame level determines whether deadly Shroud passages are survivable.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Stat icon={Mountain} label="Major regions" value="6" />
        <Stat icon={Flame} label="Flame levels" value="1–9" />
        <Stat icon={Waves} label="Current level cap" value="45" />
      </div>

      <div className="grid gap-5">
        {regions.map((region, index) => (
          <article key={region.name} className={`rounded-2xl border border-stone-800 bg-gradient-to-br ${region.tone} p-6`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Stage {index + 1}</p>
                <h2 className="mt-1 text-2xl font-bold text-stone-100">
                  {region.href ? <Link href={region.href} className="underline decoration-amber-400/30 underline-offset-4 hover:text-amber-100">{region.name}</Link> : region.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">{region.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Badge label="Levels" value={region.levels} />
                <Badge label="Flame" value={region.flame} />
              </div>
            </div>
            <div className="mt-6 grid gap-5 border-t border-stone-700/60 pt-5 md:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">Signature resources</p>
                <div className="flex flex-wrap gap-2">
                  {region.resources.map((resource) => <span key={resource} className="rounded-full bg-stone-950/60 px-3 py-1 text-xs text-stone-300">{resource}</span>)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">Prepare for</p>
                <p className="text-sm leading-6 text-stone-300">{region.preparation}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-xs text-stone-500">Reviewed for Enshrouded v0.9.1.2 on July 26, 2026.</p>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-stone-700 bg-stone-950/50 px-3 py-2 text-center"><div className="text-[10px] uppercase tracking-wider text-stone-500">{label}</div><div className="text-sm font-bold text-amber-300">{value}</div></div>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Wind; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900/50 p-4"><Icon className="h-5 w-5 text-amber-400" /><div><div className="text-xl font-bold text-stone-100">{value}</div><div className="text-xs text-stone-500">{label}</div></div></div>;
}
