const AFFILIATE_URL = "https://dathost.com/r/atlebj/valheim";
const BANNER_URL = "https://cms.dathost.net/affiliate/banners/general/dark-general-leaderboard-728x90.png";

export default function DatHostBanner() {
  return (
    <figure className="not-prose my-8 max-w-[728px]">
      <a
        href={AFFILIATE_URL}
        rel="sponsored noopener"
        target="_blank"
        aria-label="View DatHost Valheim server hosting plans (affiliate link)"
        className="block overflow-hidden rounded-lg border border-[#3a3124] bg-[#11120f] transition hover:border-[#aa7a3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e1ad5a]"
      >
        {/* DatHost supplies this remote creative for use in its affiliate program. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BANNER_URL}
          alt="DatHost game server hosting"
          width={728}
          height={90}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </a>
      <figcaption className="mt-2 text-xs leading-5 text-[#827a6c]">
        Sponsored affiliate link. Valheim Companion may earn a commission at no extra cost to you.
      </figcaption>
    </figure>
  );
}
