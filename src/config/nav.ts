import {
  BookOpen, Boxes, Calculator, CheckSquare, FileJson, Flame, Gamepad2, Hammer, Heart,
  History, Map, Rocket, Router, Search, Server, Shield, Sparkles, Users, Utensils, WandSparkles,
} from "lucide-react";
import React from "react";

export type NavLink = {
  href: string;
  label: string;
  icon?: React.ElementType;
  description?: string;
};

export type NavSection = { title: string; links: NavLink[] };

export const sections: NavSection[] = [
  {
    title: "Start Here",
    links: [
      { href: "/getting-started", label: "Getting Started", icon: BookOpen, description: "A spoiler-light route from the Cinder Vault to your first stable base." },
      { href: "/updates/current", label: "Current Version", icon: History, description: "What changed in v0.9.1.2 and what is confirmed for 1.0." },
      { href: "/enshrouded-1-0", label: "Enshrouded 1.0", icon: Rocket, description: "Release date, confirmed information, and site update status for launch." },
      { href: "/faq", label: "FAQ", icon: Search, description: "Short answers to common progression and tool questions." },
    ],
  },
  {
    title: "Game Guides",
    links: [
      { href: "/world/regions", label: "Regions of Embervale", icon: Map, description: "Level ranges, Flame requirements, hazards, and signature resources." },
      { href: "/progression/survivors", label: "Survivors", icon: Users, description: "Craftspeople, their roles, stations, and rescue order." },
      { href: "/world/shroud-exploration", label: "Shroud & Exploration", icon: WandSparkles, description: "Shroud timers, deadly passages, travel, and expedition preparation." },
      { href: "/guides/builds", label: "Build Foundations", icon: Shield, description: "Practical melee, ranged, magic, and co-op build principles." },
      { href: "/crafting/progression", label: "Crafting Progression", icon: Boxes, description: "Which craftsperson and workstation unlocks each production tier." },
      { href: "/guides/food", label: "Food & Consumables", icon: Utensils, description: "Food slots, food types, expedition buffs, and preparation." },
      { href: "/building/base-planning", label: "Base Planning", icon: Hammer, description: "Altar coverage, storage, production flow, water, and NPC shelter." },
      { href: "/building/comfort", label: "Comfort Guide", icon: Heart, description: "How shelter, warmth, and comfort extend Rested duration." },
    ],
  },
  {
    title: "Servers & Gear",
    links: [
      { href: "/servers", label: "Dedicated Servers", icon: Server, description: "Install, configure, troubleshoot, back up, or migrate a persistent world." },
      { href: "/guides/server-hosting", label: "Server Hosting", icon: Server, description: "Compare managed Enshrouded hosts for persistent co-op worlds." },
      { href: "/guides/best-router-for-enshrouded-self-hosting", label: "Home Server Network", icon: Router, description: "Router and network picks for a reliable home dedicated server." },
      { href: "/guides/best-gear-for-enshrouded", label: "Best Gear", icon: Gamepad2, description: "Useful controller, mouse, headset, and storage picks for Enshrouded." },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools/resources", label: "Resource Finder", icon: Sparkles, description: "Search important materials by region, source, and use." },
      { href: "/tools/server-config", label: "Server Config Generator", icon: FileJson, description: "Generate the core enshrouded_server.json safely." },
      { href: "/tools/flame-planner", label: "Flame Upgrade Planner", icon: Flame, description: "Requirements and checklist for Flame levels 2 through 9." },
      { href: "/tools/skill-points", label: "Skill Point Calculator", icon: Calculator, description: "Calculate earned and remaining skill points up to level 45." },
      { href: "/tools/rested", label: "Rested Calculator", icon: Calculator, description: "Estimate Rested stamina and regeneration by character level." },
      { href: "/checklist", label: "Adventure Checklist", icon: CheckSquare, description: "A locally saved progression checklist for your current world." },
    ],
  },
];
