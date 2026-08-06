import { BookOpen, DatabaseBackup, FileText, History, MountainSnow, Network, Rocket, Server, Shield, Wrench } from "lucide-react";
import React from "react";
import { routes, type RoutePath } from "./routes";

export type NavLink = { href: RoutePath; label: string; icon?: React.ElementType; description?: string };
export type NavSection = { title: string; links: NavLink[] };

export const sections: NavSection[] = [
  {
    title: "Start Here",
    links: [
      { href: routes.valheimOne, label: "Valheim 1.0", icon: Rocket, description: "Release date, platforms, saves, achievements, price, and crossplay." },
      { href: routes.deepNorth, label: "Deep North", icon: MountainSnow, description: "Confirmed features and launch preparation for Valheim's final biome." },
      { href: routes.updates, label: "Updates", icon: History, description: "Official-source monitoring and guide review status." },
    ],
  },
  {
    title: "Servers",
    links: [
      { href: routes.servers, label: "Server Hub", icon: Server, description: "Dedicated-server, migration, backup, crossplay, and hosting topics." },
      { href: routes.dedicatedServerSetup, label: "Dedicated Server Setup", icon: Wrench },
      { href: routes.updatingServer, label: "Updating a Server", icon: History },
      { href: routes.worldBackupRestore, label: "Backup & Restore", icon: DatabaseBackup },
      { href: routes.moveLocalWorld, label: "Move a Local World", icon: FileText },
      { href: routes.crossplay, label: "Crossplay", icon: Network },
      { href: routes.serverSettings, label: "Settings Generator", icon: Wrench },
      { href: routes.serverNotShowing, label: "Connection Help", icon: Network },
      { href: routes.serverHosting, label: "Server Hosting", icon: Shield },
    ],
  },
  {
    title: "Project",
    links: [
      { href: routes.about, label: "About", icon: BookOpen },
      { href: routes.dataSources, label: "Data Sources", icon: FileText },
      { href: routes.editorialPolicy, label: "Editorial Policy", icon: Shield },
    ],
  },
];
