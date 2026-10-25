"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { usePathname } from "next/navigation";

const providerNames: Record<string, string> = {
  "survivalservers.com": "Survival Servers",
  "dathost.com": "DatHost",
  "supercraft.host": "Supercraft",
  "shockbyte.com": "Shockbyte",
  "nitrado-aff.com": "Nitrado",
  "g-portal.com": "GPORTAL",
  "apexminecrafthosting.com": "Apex Hosting",
  "billing.apexminecrafthosting.com": "Apex Hosting",
  "winternode.com": "WinterNode",
  "clients.winternode.com": "WinterNode",
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function providerFor(href: string) {
  try {
    const hostname = new URL(href).hostname.replace(/^www\./, "");
    return providerNames[hostname] ?? hostname;
  } catch {
    return "unknown";
  }
}

export default function TrackedAnchor({ onClick, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const pathname = usePathname();
  const href = typeof props.href === "string" ? props.href : "";
  const sponsored = (props.rel ?? "").split(/\s+/).includes("sponsored");

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || !sponsored || !href) return;

    const provider = providerFor(href);
    const properties = { provider, source_path: pathname };
    track("affiliate_click", properties);
    window.gtag?.("event", "affiliate_click", {
      ...properties,
      link_url: href,
      transport_type: "beacon",
    });
  }

  return <a {...props} onClick={handleClick}>{children}</a>;
}
