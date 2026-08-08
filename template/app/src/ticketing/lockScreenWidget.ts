/**
 * Lock Screen Live Activity & Web Notification bridge.
 * Surfaces dynamic QR codes directly to the device lock screen without opening the browser.
 */

export async function requestLockScreenNotificationPermission(): Promise<boolean> {
  if (typeof window !== "undefined" && "Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}

export function displayLockScreenTicketNotification(
  eventTitle: string,
  seatInfo: string,
  tokenPayload: string
) {
  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(`🎟️ Entrada Activa: ${eventTitle}`, {
        body: `${seatInfo} • Token: ${tokenPayload.slice(0, 8)}... (Listo en molinete)`,
        icon: "/favicon.ico",
        tag: "active-stadium-ticket",
        silent: true,
      });
    } catch (e) {
      console.warn("[LockScreenWidget] Notification display failed", e);
    }
  }
}
