export const routes = {
  home: "/",
  valheimOne: "/valheim-1-0",
  deepNorth: "/deep-north",
  updates: "/updates",
  servers: "/servers",
  dedicatedServerSetup: "/servers/dedicated-server-setup",
  updatingServer: "/servers/updating-a-server",
  existingOrNewWorld: "/servers/existing-world-vs-new-world",
  worldBackupRestore: "/servers/world-backup-restore",
  moveLocalWorld: "/servers/move-local-world-to-server",
  crossplay: "/servers/crossplay",
  serverNotShowing: "/servers/server-not-showing",
  serverRequirements: "/servers/server-requirements",
  serverSettings: "/servers/server-settings",
  serverHosting: "/servers/best-server-hosting",
  about: "/about",
  contact: "/contact",
  dataSources: "/data-sources",
  editorialPolicy: "/editorial-policy",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

