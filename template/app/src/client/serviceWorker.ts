/**
 * Service Worker registration & cache manager for 100% offline super-app experience.
 */

const CACHE_NAME = "super-app-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/tickets",
  "/parking",
  "/transit",
  "/concessions",
];

export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // Register service worker if supported
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[SuperApp PWA] Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[SuperApp PWA] Service Worker registration failed:", err);
        });
    });
  }
}

export async function cacheEssentialTickets(ticketPayloads: unknown[]) {
  if (typeof window !== "undefined" && "caches" in window) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const blob = new Blob([JSON.stringify(ticketPayloads)], { type: "application/json" });
      const response = new Response(blob, { status: 200, headers: { "Content-Type": "application/json" } });
      await cache.put("/offline-vault/tickets.json", response);
    } catch (e) {
      console.warn("[SuperApp PWA] Failed caching tickets to Cache Storage", e);
    }
  }
}

export async function getCachedTickets(): Promise<unknown[] | null> {
  if (typeof window !== "undefined" && "caches" in window) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const match = await cache.match("/offline-vault/tickets.json");
      if (match) {
        return await match.json();
      }
    } catch (e) {
      console.warn("[SuperApp PWA] Error reading cached tickets", e);
    }
  }
  return null;
}
