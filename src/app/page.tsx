import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, DatabaseBackup, MountainSnow, Network, Server } from "lucide-react";
import { createPageMetadata } from "../config/metadata";
import { routes } from "../config/routes";
import { site } from "../config/site";

export const metadata = createPageMetadata({
  title: "Valheim 1.0, Deep North & Dedicated Server Guides",
  description: site.description,
  path: routes.home,
});

const focus = [
  { href: routes.valheimOne, icon: CalendarDays, title: "Valheim 1.0", text: "Confirmed release information and preparation coverage." },
  { href: routes.deepNorth, icon: MountainSnow, title: "Deep North", text: "Official announcements for Valheim's final biome." },
  { href: routes.servers, icon: Server, title: "Dedicated servers", text: "Setup, updates, crossplay, migration, backups, and hosting." },
];

export default function Home() {
  return <div className="mx-auto max-w-6xl py-4 sm:py-8">
    <section className="hero-grid relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-[#4a3926] bg-[#141611] px-7 py-14 shadow-2xl sm:px-12 sm:py-20">
      <Image
        src="/images/valheim-companion-hero.png"
        alt="A snowy northern coast with a sheltered timber home and boat beneath an aurora"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover object-[68%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,15,13,0.98)_0%,rgba(12,15,13,0.92)_42%,rgba(12,15,13,0.38)_72%,rgba(12,15,13,0.16)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,12,10,0.66)_0%,transparent_48%)]" />
      <div className="relative z-10 max-w-3xl lg:max-w-[62%]">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#e2ad5a]">Verified guidance, deliberately focused</p>
        <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.055em] text-[#f4ead4] sm:text-7xl">Valheim 1.0.<br /><span className="text-[#9bc2c7]">Worlds worth protecting.</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#b9b09f]">{site.description}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href={routes.valheimOne} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#b56f2a] px-5 py-3 font-bold text-white hover:bg-[#ce8234]">View confirmed 1.0 information <ArrowRight className="h-4 w-4" /></Link>
          <Link href={routes.dataSources} className="inline-flex items-center justify-center rounded-lg border border-[#786044] px-5 py-3 font-bold text-[#e6dcc8] hover:border-[#b8884e]">How sources are verified</Link>
        </div>
      </div>
    </section>
    <section className="mt-10" aria-labelledby="focus-heading">
      <p className="section-kicker">First public release</p><h2 id="focus-heading" className="mt-2 text-3xl font-black text-[#eee4d1]">A focused companion, not another broad wiki</h2>
      <p className="mt-4 max-w-3xl leading-7 text-[#a79e8e]">The site covers time-sensitive release and server decisions with primary sources, visible review dates, and a clear line between confirmed information and launch-day unknowns.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">{focus.map(({ href, icon: Icon, title, text }) => <Link key={href} href={href} className="group rounded-2xl border border-[#393126] bg-[#171914] p-6 hover:border-[#8b6538]"><Icon className="h-5 w-5 text-[#8db6ba]" /><h3 className="mt-6 text-xl font-black text-[#e9dfcb] group-hover:text-[#f0bd68]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#a79e8e]">{text}</p></Link>)}</div>
    </section>
    <section className="mt-10 rounded-2xl border border-[#35504e] bg-[#14211e] p-6 sm:p-8"><div className="flex gap-4"><DatabaseBackup className="mt-1 h-6 w-6 shrink-0 text-[#8db6ba]" /><div><h2 className="text-xl font-black text-[#e8e0cf]">Backup-first server guidance</h2><p className="mt-2 leading-7 text-[#aebdb7]">Migration, update, and restore pages begin as factual scopes. Procedures will expand only where current official sources support the steps.</p><Link href={routes.servers} className="mt-4 inline-flex items-center gap-2 font-bold text-[#e1ad5a]">Browse server topics <Network className="h-4 w-4" /></Link></div></div></section>
  </div>;
}
