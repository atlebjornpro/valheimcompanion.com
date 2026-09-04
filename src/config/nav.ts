import { BookOpen, Bug, Crown, DatabaseBackup, FileText, Flame, Hammer, History, Map, Milestone, MountainSnow, Network, PawPrint, Rocket, Server, Shield, Skull, Snowflake, Soup, Sparkles, Swords, Terminal, TreePine, Trees, Waves, Wheat, Wrench, Zap } from "lucide-react";
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
    title: "1.0 Launch",
    links: [
      { href: routes.valheimOnePreparation, label: "Preparation Checklist", icon: FileText, description: "Backups, worlds, servers, mods, and launch-day verification." },
      { href: routes.valheimAchievements, label: "Achievements & Cheats", icon: Shield, description: "Old saves, devcommands, spawned items, and eligibility." },
      { href: routes.valheimMods, label: "Mod Compatibility", icon: Wrench, description: "A rollback-first plan for mods, BepInEx, and servers." },
      { href: routes.valheimRequirements, label: "Requirements & Download", icon: FileText, description: "Current PC, Mac, Linux requirements and download estimates." },
      { href: routes.valheimPs5, label: "PlayStation 5", icon: Rocket, description: "Release date, PS Plus, crossplay, saves, and mods." },
      { href: routes.valheimSwitch2, label: "Nintendo Switch 2", icon: Rocket, description: "Crossplay, platform features, saves, and online play." },
    ],
  },
  {
    title: "World",
    links: [
      { href: routes.world, label: "World Guide", icon: Map, description: "Every released biome — creatures, resources, and bosses, in progression order." },
      { href: routes.regionMeadows, label: "Meadows", icon: Trees },
      { href: routes.regionBlackForest, label: "Black Forest", icon: TreePine },
      { href: routes.regionSwamp, label: "Swamp", icon: Waves },
      { href: routes.regionMountain, label: "Mountain", icon: MountainSnow },
      { href: routes.regionPlains, label: "Plains", icon: Wheat },
      { href: routes.regionMistlands, label: "Mistlands", icon: Sparkles },
      { href: routes.regionAshlands, label: "Ashlands", icon: Flame },
    ],
  },
  {
    title: "Bosses",
    links: [
      { href: routes.bosses, label: "Boss Guide", icon: Swords, description: "How to summon and beat every released boss, in progression order." },
      { href: routes.bossEikthyr, label: "Eikthyr", icon: Zap },
      { href: routes.bossTheElder, label: "The Elder", icon: TreePine },
      { href: routes.bossBonemass, label: "Bonemass", icon: Skull },
      { href: routes.bossModer, label: "Moder", icon: Snowflake },
      { href: routes.bossYagluth, label: "Yagluth", icon: Flame },
      { href: routes.bossTheQueen, label: "The Queen", icon: Bug },
      { href: routes.bossFader, label: "Fader", icon: Crown },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: routes.progressionRoadmap, label: "Progression Roadmap", icon: Milestone, description: "Biomes, bosses, and crafting stations tied together in order." },
      { href: routes.buildingGuide, label: "Building & Base Locations", icon: Hammer },
      { href: routes.foodAndCooking, label: "Food & Cooking", icon: Soup },
      { href: routes.taming, label: "Taming", icon: PawPrint },
      { href: routes.consoleCommands, label: "Console Commands", icon: Terminal },
    ],
  },
  {
    title: "Servers",
    links: [
      { href: routes.servers, label: "Server Hub", icon: Server, description: "Dedicated-server, migration, backup, crossplay, and hosting topics." },
      { href: routes.dedicatedServerSetup, label: "Dedicated Server Setup", icon: Wrench },
      { href: routes.serverRequirements, label: "Server Requirements", icon: FileText },
      { href: routes.updatingServer, label: "Updating a Server", icon: History },
      { href: routes.worldBackupRestore, label: "Backup & Restore", icon: DatabaseBackup },
      { href: routes.moveLocalWorld, label: "Move a Local World", icon: FileText },
      { href: routes.existingOrNewWorld, label: "Existing or New World?", icon: FileText },
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
