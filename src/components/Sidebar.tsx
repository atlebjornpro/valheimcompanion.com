"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections, NavLink } from "../config/nav";
import { ChevronDown, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const pathname = usePathname();
  // Initialize all sections as expanded
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>(
    sections.reduce((acc, sec) => ({ ...acc, [sec.title]: true }), {})
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-slate-800 h-screen sticky top-0 bg-[#111521]/95 backdrop-blur-xl">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-6">
          {sections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <button
                onClick={() => toggleSection(sec.title)}
                className="flex items-center w-full text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors px-2 py-1 mb-2 group select-none"
              >
                <span className="flex-1 text-left">{sec.title}</span>
                {expandedSections[sec.title] ? (
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                ) : (
                  <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                )}
              </button>

              {expandedSections[sec.title] && (
                <ul className="space-y-0.5">
                  {sec.links.map((l) => (
                    <NavItem key={l.href} link={l} pathname={pathname} />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function NavItem({ link, pathname }: { link: NavLink; pathname: string }) {
  const isActive = pathname === link.href;
  const Icon = link.icon;

  return (
    <li className="relative group">
      <Link
        href={link.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800/50",
          isActive
            ? "bg-[#607dff]/10 text-[#9aabff] font-medium shadow-sm ring-1 ring-[#607dff]/25"
            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              isActive ? "text-[#738bff]" : "text-neutral-400 group-hover:text-neutral-300 dark:text-neutral-500 dark:group-hover:text-neutral-300"
            )}
          />
        )}
        <span className="truncate">{link.label}</span>
      </Link>

      {/* Tooltip on hover */}
      {link.description && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-neutral-900 dark:bg-neutral-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none translate-x-2 group-hover:translate-x-0 border border-neutral-700/50">
          <div className="font-semibold mb-1 text-[#9aabff]">{link.label}</div>
          <div className="text-neutral-300 leading-relaxed">{link.description}</div>
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-neutral-900 dark:bg-neutral-800 rotate-45 border-l border-b border-neutral-700/50" />
        </div>
      )}
    </li>
  );
}
