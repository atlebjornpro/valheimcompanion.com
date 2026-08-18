import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONSENT_REGION_COOKIE } from "./config/consent";

// EEA member states plus the UK and Switzerland get the strict, opt-in-by-default
// analytics consent flow (GDPR/UK GDPR territory). Everywhere else defaults to
// opted-in-but-easily-rejectable, since an opt-out model is standard, compliant
// practice outside that region and yields measurable analytics instead of a
// consent banner most visitors never interact with.
const STRICT_CONSENT_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL", "PT", "RO",
  "SK", "SI", "ES", "SE", "GB", "CH",
]);

export function proxy(request: NextRequest) {
  const country = (request.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
  const region = STRICT_CONSENT_COUNTRIES.has(country) ? "eea" : "row";

  // Write the cookie onto the incoming request too, so Server Components
  // rendered for this same request (via cookies()) see it immediately
  // instead of only on the next navigation.
  request.cookies.set(CONSENT_REGION_COOKIE, region);
  const response = NextResponse.next({ request });
  response.cookies.set(CONSENT_REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
