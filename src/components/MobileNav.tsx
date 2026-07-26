"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, CheckSquare, Flame, Home, Map } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/world/regions", label: "World", icon: Map },
  { href: "/tools/flame-planner", label: "Flame", icon: Flame },
  { href: "/tools/resources", label: "Resources", icon: Calculator },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-slate-800 bg-[#10131e] p-2 md:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link key={href} href={href} className={clsx("flex w-full flex-col items-center justify-center py-1 text-[10px]", isActive ? "text-[#7188ff]" : "text-slate-500 hover:text-slate-300")}>
            <Icon className="mb-1 h-5 w-5" /><span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
