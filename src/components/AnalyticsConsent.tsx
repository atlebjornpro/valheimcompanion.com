"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { routes } from "../config/routes";
import { site } from "../config/site";

type AnalyticsConsentState = "granted" | "denied";

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
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });
}

function setGoogleAnalyticsDisabled(disabled: boolean) {
  const windowFlags = window as unknown as Record<string, unknown>;
  windowFlags[`ga-disable-${site.analytics.measurementId}`] = disabled;
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

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [tagReady, setTagReady] = useState(false);

  useEffect(() => {
    initializeDataLayer();
    window.gtag?.("consent", "default", deniedConsent);

    if (consent === "granted") {
      setGoogleAnalyticsDisabled(false);
      window.gtag?.("consent", "update", {
        ...deniedConsent,
        analytics_storage: "granted",
      });
    } else {
      setGoogleAnalyticsDisabled(true);
      window.gtag?.("consent", "update", deniedConsent);
      if (consent === "denied") clearGoogleAnalyticsCookies();
    }
  }, [consent]);

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(preferencesEvent, openPreferences);
    return () => window.removeEventListener(preferencesEvent, openPreferences);
  }, []);

  useEffect(() => {
    if (consent !== "granted" || !tagReady) return;

    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [consent, pathname, tagReady]);

  function saveConsent(nextConsent: AnalyticsConsentState) {
    try {
      window.localStorage.setItem(site.analytics.consentStorageKey, nextConsent);
    } catch {
      // The choice still applies for this page even if it cannot be persisted.
    }

    initializeDataLayer();
    const granted = nextConsent === "granted";
    setGoogleAnalyticsDisabled(!granted);
    window.gtag?.("consent", "update", {
      ...deniedConsent,
      analytics_storage: granted ? "granted" : "denied",
    });

    if (!granted) {
      clearGoogleAnalyticsCookies();
      setTagReady(false);
    }

    window.dispatchEvent(new Event(consentChangedEvent));
    setPreferencesOpen(false);
  }

  return (
    <>
      {consent === "granted" ? (
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
              send_page_view: false,
            });
            setTagReady(true);
          }}
        />
      ) : null}

      {consent === null || preferencesOpen ? (
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
            Allow Google Analytics to measure visits and help improve this site. The tag stays off until you
            choose Allow. Advertising storage and personalization remain disabled. Read the{" "}
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
