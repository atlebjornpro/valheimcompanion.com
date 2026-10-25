import Link from "next/link";
import TrackedAnchor from "./TrackedAnchor";

const SURVIVAL_SERVERS_URL = "https://www.survivalservers.com/r/gamecompanions/valheim";

const copy = {
  crossplay: {
    title: "Want crossplay without maintaining the server?",
    body: "Survival Servers advertises Valheim crossplay, automatic backups, full file access, and a managed control panel. Confirm the selected location, billing term, and renewal total before ordering.",
  },
  migration: {
    title: "Prefer to have the world hosted continuously?",
    body: "Survival Servers provides full FTP access for world uploads, automatic backups, location switching, and a managed panel. Keep your original world files until the imported copy has been tested.",
  },
  backups: {
    title: "Want managed backups and an always-on world?",
    body: "Survival Servers advertises automatic world backups alongside full FTP access and a managed Valheim panel. Verify retention and restore options for the plan you select.",
  },
  updates: {
    title: "Want a host to handle routine server updates?",
    body: "Survival Servers advertises managed updates, automatic backups, crossplay, and full FTP access. You should still keep an independent world backup before major game updates.",
  },
  troubleshooting: {
    title: "Done troubleshooting ports and home-network uptime?",
    body: "A managed host removes home port forwarding and keeps the world online when your PC is off. Survival Servers advertises crossplay, location switching, backups, and full FTP access.",
  },
  configuration: {
    title: "Rather use a managed control panel?",
    body: "Survival Servers advertises a custom Valheim panel, crossplay, automatic backups, full FTP access, and mod installers without separate RAM or storage tiers.",
  },
  newWorld: {
    title: "Keep the group's 1.0 world online",
    body: "Survival Servers advertises crossplay, world uploads, automatic backups, and location switching. Test a copied save before moving the group permanently.",
  },
  console: {
    title: "Need an always-on crossplay server?",
    body: "Survival Servers advertises PC-and-console crossplay, automatic backups, location switching, and a managed Valheim control panel.",
  },
} as const;

export default function ManagedHostingCallout({ context }: { context: keyof typeof copy }) {
  const content = copy[context];

  return (
    <aside className="not-prose my-8 rounded-xl border border-[#5b4932] bg-[#171712] p-5" aria-label="Managed Valheim hosting option">
      <p className="text-xs font-black uppercase tracking-wider text-[#8db6ba]">Managed hosting option</p>
      <h2 className="mt-2 text-xl font-bold text-[#eee4d1]">{content.title}</h2>
      <p className="mt-3 leading-7 text-[#b9b09f]">{content.body}</p>
      <p className="mt-3 text-sm text-[#8f8778]">Current offer: 25% off the first payment with code <strong className="text-[#d8c9ae]">VALHEIM25</strong>. Affiliate link; the site may earn a commission at no extra cost to you.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <TrackedAnchor href={SURVIVAL_SERVERS_URL} rel="sponsored noopener" target="_blank" className="inline-flex min-h-11 items-center rounded-lg bg-[#d69a45] px-4 py-2 text-sm font-black text-[#17130d] no-underline hover:bg-[#e8ad58]">
          See Survival Servers plans
        </TrackedAnchor>
        <Link href="/servers/best-server-hosting" prefetch={false} className="inline-flex min-h-11 items-center rounded-lg border border-[#78664d] px-4 py-2 text-sm font-bold text-[#eee4d1] no-underline hover:border-[#a58a63]">
          Compare all hosts
        </Link>
      </div>
    </aside>
  );
}
