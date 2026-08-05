export const site = {
  name: "Valheim Companion",
  shortName: "Valheim Companion",
  game: "Valheim",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.valheimcompanion.com",
  description:
    "Verified Valheim 1.0, Deep North, crossplay, world migration, backup, and dedicated-server guidance.",
  locale: "en_US",
  language: "en",
  developer: "Iron Gate AB",
  publisher: "Coffee Stain Publishing",
  release: {
    version: "1.0",
    date: "2026-09-09",
  },
  focus: [
    "Valheim 1.0",
    "Deep North",
    "Dedicated servers",
    "Crossplay",
    "World migration and backups",
    "Server hosting",
  ],
  officialSources: {
    news: "https://www.valheimgame.com/news/",
    releaseAnnouncement: "https://www.valheimgame.com/news/valheim-has-a-release-date-/",
    serverGuide: "https://valheim.com/support/a-guide-to-dedicated-servers/",
    crossplayFaq: "https://valheim.com/support/crossplay-faq/",
  },
  analytics: {
    provider: "Google Analytics",
    measurementId:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "G-MZJQXDQC4B",
    consentStorageKey: "valheim-companion:analytics-consent:v1",
  },
} as const;
