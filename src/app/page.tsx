import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Search, Server, Shield } from "lucide-react";
import { sections } from "../config/nav";
import { createPageMetadata } from "../config/metadata";

const sectionHrefs: Record<string, string> = {
  "Start Here": "/getting-started",
  "Game Guides": "/guides",
  "Servers & Gear": "/servers",
  Tools: "/tools",
};

export const metadata = createPageMetadata({
  title: "Enshrouded Companion: Guides, Builds, Tools & Server Help",
  description:
    "Enshrouded guides, builds, resource locations, Flame upgrade requirements, planning tools, and dedicated-server help for the current version.",
  path: "/",
});

const entryPoints = [
  { href: "/getting-started", label: "New Player Guide", description: "Follow a practical route through your first tools, survivors, and stable base.", icon: BookOpen },
  { href: "/tools/resources", label: "Find a Resource", description: "Search materials by Embervale region, gathering source, and crafting use.", icon: Search },
  { href: "/guides/builds", label: "Choose a Build", description: "Compare current melee, ranger, and wizard builds for solo or co-op play.", icon: Shield },
  { href: "/servers", label: "Set Up a Server", description: "Self-host, troubleshoot, protect a world, or compare managed providers.", icon: Server },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl py-8 sm:py-12">
      <section className="relative min-h-[500px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        <Image
          src="/images/enshrouded-hero.png"
          alt="A Flameborn adventurer overlooking the mist-covered ruins of Embervale"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d16] via-[#0b0d16]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d16]/60 via-transparent to-[#0b0d16]/10" />
        <div className="relative z-10 flex min-h-[500px] max-w-xl flex-col justify-center px-7 py-12 sm:px-12">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
            <Flame className="h-3.5 w-3.5" />
            Enshrouded v0.9.1.2
          </div>
          <h1 className="text-5xl font-black leading-[0.94] tracking-tight text-[#607dff] sm:text-7xl">
            Enshrouded
            <span className="block">Companion</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-300">
            Enshrouded guides, build planning, resource locations, Flame upgrade
            requirements, and dedicated-server help—reviewed for the current version.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/getting-started"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5876f4] px-5 py-3 font-bold text-white transition hover:bg-[#6d88ff]"
            >
              New Player Guide
            </Link>
            <Link
              href="/tools/resources"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#5876f4] bg-[#0d1120]/80 px-5 py-3 font-bold text-[#7790ff] transition hover:bg-[#151b30]"
            >
              Find a Resource
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-9" aria-labelledby="quick-start-heading">
        <h2 id="quick-start-heading" className="text-2xl font-black text-slate-100">What do you want to do?</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entryPoints.map(({ href, label, description, icon: Icon }) => (
            <Link key={href} href={href} className="group rounded-2xl border border-slate-800 bg-[#111521] p-5 transition hover:-translate-y-0.5 hover:border-[#607dff]/50">
              <Icon className="h-5 w-5 text-[#7790ff]" />
              <h3 className="mt-4 font-bold text-slate-100 group-hover:text-[#9aabff]">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-800 bg-[#111521] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-slate-100">
              <Link href={sectionHrefs[section.title] ?? "/guides"} className="transition hover:text-[#8da0ff]">
                {section.title}
              </Link>
            </h2>
            <ul className="space-y-1">
              {section.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800/60 hover:text-[#8da0ff]"
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-[#6f86f8]" />}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
