const SURVIVAL_SERVERS_URL = "https://www.survivalservers.com/r/gamecompanions/valheim";

const recommendations = [
  {
    eyebrow: "BEST ALL-AROUND 10-SLOT PLAN",
    name: "Survival Servers",
    summary: "A feature-rich 10-slot plan with a custom panel, full file access, and no RAM or storage tiers.",
    price: "$9.71 first month with code VALHEIM25; $12.95/month renewal.",
    detail: "Crossplay, ValheimOne live map and console, automatic backups, full FTP access, and BepInEx/ValheimPlus support.",
    href: SURVIVAL_SERVERS_URL,
    cta: "See Survival Servers plans",
  },
  {
    eyebrow: "LOWEST INTRODUCTORY PRICE",
    name: "DatHost",
    summary: "A simple 10-slot plan with broad location choice and one-click world management.",
    price: "€1 first month; €14.90/month renewal on monthly billing.",
    detail: "Mods, crossplay, automatic updates and backups, and 49 advertised locations.",
    href: "https://dathost.com/r/atlebj/valheim",
    cta: "See DatHost plans",
  },
  {
    eyebrow: "LOWEST REGULAR PRICE",
    name: "Supercraft",
    summary: "Clear 5-, 10-, and 30-player plans with crossplay on every tier.",
    price: "$7.99/month for 5 players; $12.99/month for 10.",
    detail: "Four regions and daily backups. Mod support starts on the 10-player plan.",
    href: "https://supercraft.host/valheim-server-hosting/?fpr=atle10",
    cta: "See Supercraft plans",
  },
];

export default function HostingRecommendations() {
  return (
    <section className="not-prose my-8" aria-labelledby="hosting-recommendations-heading">
      <h2 id="hosting-recommendations-heading" className="border-t border-[#393126] pt-6 text-2xl font-bold tracking-tight text-[#eee4d1]">
        Quick recommendations
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-[#aaa18f]">
        Three useful starting points for Valheim hosting. Compare the renewal price and nearest location before ordering.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {recommendations.map((recommendation) => (
          <article key={recommendation.name} className="flex h-full flex-col rounded-xl border border-[#514537] bg-[#141914] p-5">
            <p className="text-xs font-black uppercase tracking-wider text-[#8db6ba]">{recommendation.eyebrow}</p>
            <h3 className="mt-5 text-xl font-bold text-[#eee4d1]">{recommendation.name}</h3>
            <p className="mt-3 leading-7 text-[#d7cdbb]">{recommendation.summary}</p>
            <p className="mt-4 text-sm leading-6 text-[#e1ad5a]">{recommendation.price}</p>
            <p className="mt-2 text-sm leading-6 text-[#aaa18f]">{recommendation.detail}</p>
            <a
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#8db6ba] px-4 py-2 text-center text-sm font-bold text-[#eee4d1] no-underline transition hover:bg-[#202820]"
              href={recommendation.href}
              rel="sponsored noopener"
              style={{ color: "#eee4d1", textDecoration: "none" }}
              target="_blank"
            >
              {recommendation.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
