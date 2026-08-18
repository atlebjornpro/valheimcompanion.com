"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { routes } from "../config/routes";
import { site } from "../config/site";
import type { ConsentRegion } from "../config/consent";

type AnalyticsConsentState = "granted" | "denied";
type AnalyticsConsentProps = { region: ConsentRegion };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const preferencesEvent = "valheim-companion:open-analytics-preferences";
const consentChangedEvent = "valheim-companion:analytics-consent-changed";
const deniedConsent = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

function initializeDataLayer() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    (function () {
      // The documented gtag queue format uses the function's Arguments object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    });
}

function clearGoogleAnalyticsCookies() {
  const hostname = window.location.hostname;
  const labels = hostname.split(".");
  const parentDomain = labels.length > 2 ? labels.slice(-2).join(".") : hostname;
  const domains = new Set([hostname, `.${hostname}`, parentDomain, `.${parentDomain}`]);

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || (name !== "_ga" && !name.startsWith("_ga_"))) continue;

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    }
  }
}

function readConsent(): AnalyticsConsentState | null {
  try {
    const value = window.localStorage.getItem(site.analytics.consentStorageKey);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function subscribeToConsent(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === site.analytics.consentStorageKey) onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(consentChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(consentChangedEvent, onStoreChange);
  };
}

export function AnalyticsPreferencesButton() {
  return (
    <button
      type="button"
      className="hover:text-[#e1ad5a]"
      onClick={() => window.dispatchEvent(new Event(preferencesEvent))}
    >
      Analytics choices
    </button>
  );
}

export default function AnalyticsConsent({ region }: AnalyticsConsentProps) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [tagReady, setTagReady] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  // Outside the EEA/UK/Switzerland, an opt-out model is standard, compliant
  // practice: visitors start counted, and can opt out at any time via the
  // "Analytics choices" control. Inside that region, nothing is granted until
  // the visitor explicitly chooses "Allow" (consent === null stays denied).
  const impliedGranted = region === "row";
  const effectiveConsent: AnalyticsConsentState = consent ?? (impliedGranted ? "granted" : "denied");
  const showDialog = preferencesOpen || (consent === null && !impliedGranted);

  useEffect(() => {
    initializeDataLayer();

    if (effectiveConsent === "granted") {
      window.gtag?.("consent", "update", {
        ...deniedConsent,
        analytics_storage: "granted",
      });
    } else {
      window.gtag?.("consent", "update", deniedConsent);
      // Only actively clear cookies on an explicit rejection — not merely
      // because no choice has been recorded yet.
      if (consent === "denied") clearGoogleAnalyticsCookies();
    }
  }, [effectiveConsent, consent]);

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(preferencesEvent, openPreferences);
    return () => window.removeEventListener(preferencesEvent, openPreferences);
  }, []);

  useEffect(() => {
    if (!tagReady) return;

    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = pathname;
      return;
    }

    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname, tagReady]);

  function saveConsent(nextConsent: AnalyticsConsentState) {
    try {
      window.localStorage.setItem(site.analytics.consentStorageKey, nextConsent);
    } catch {
      // The choice still applies for this page even if it cannot be persisted.
    }

    initializeDataLayer();
    const granted = nextConsent === "granted";
    window.gtag?.("consent", "update", {
      ...deniedConsent,
      analytics_storage: granted ? "granted" : "denied",
    });

    if (!granted) {
      clearGoogleAnalyticsCookies();
    }

    window.dispatchEvent(new Event(consentChangedEvent));
    setPreferencesOpen(false);
  }

  return (
    <>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics.measurementId}`}
        strategy="afterInteractive"
        onReady={() => {
          initializeDataLayer();
          window.gtag?.("js", new Date());
          window.gtag?.("config", site.analytics.measurementId, {
            allow_ad_personalization_signals: false,
            allow_google_signals: false,
          });
          setTagReady(true);
        }}
      />

      {showDialog ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="analytics-consent-title"
          className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-2xl rounded-2xl border border-[#5b4932] bg-[#111713] p-5 shadow-2xl md:bottom-6"
        >
          <h2 id="analytics-consent-title" className="text-base font-black text-[#f2e8d0]">
            Optional analytics
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#b9b09f]">
            {impliedGranted ? (
              <>
                Google Analytics storage is on by default for visitors outside the EEA, UK, and Switzerland, to
                help measure visits and improve this site. Choose Reject at any time to turn it off. Advertising
                storage and personalization remain disabled regardless.
              </>
            ) : (
              <>
                Allow Google Analytics storage to help measure visits and improve this site. Until you choose
                Allow, Google receives consent-aware measurements without Analytics cookies. Advertising storage
                and personalization remain disabled.
              </>
            )}{" "}
            Read the{" "}
            <Link href={routes.privacy} className="font-bold text-[#e1ad5a] hover:underline">
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-lg border border-[#78664d] px-4 py-2 text-sm font-bold text-[#e8e0cf] hover:border-[#a58a63]"
              onClick={() => saveConsent("denied")}
            >
              Reject analytics
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#d69a45] px-4 py-2 text-sm font-black text-[#17130d] hover:bg-[#e8ad58]"
              onClick={() => saveConsent("granted")}
            >
              Allow analytics
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
