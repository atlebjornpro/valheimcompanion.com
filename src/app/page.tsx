import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { sections } from "../config/nav";

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
            Clear progression guides, current mechanics, resource locations,
            build foundations, and practical tools to help you master Embervale.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/world/regions"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5876f4] px-5 py-3 font-bold text-white transition hover:bg-[#6d88ff]"
            >
              Explore Embervale
            </Link>
            <Link
              href="/tools/flame-planner"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#5876f4] bg-[#0d1120]/80 px-5 py-3 font-bold text-[#7790ff] transition hover:bg-[#151b30]"
            >
              Flame Planner
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-800 bg-[#111521] p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-slate-100">{section.title}</h2>
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
