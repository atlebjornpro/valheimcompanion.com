// Shared between src/middleware.ts (which sets this cookie based on visitor
// geography) and the Server/Client components that read it to decide the
// analytics consent default. Kept out of middleware.ts so app code doesn't
// need to import next/server-only symbols just to read a cookie name.
export const CONSENT_REGION_COOKIE = "vc-consent-region";
export type ConsentRegion = "eea" | "row";
