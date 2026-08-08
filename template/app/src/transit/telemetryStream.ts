/**
 * Live GPS Telemetry Stream (SSE Simulation) & Waypoint Interpolator.
 */

export interface BusTelemetryFrame {
  tripId: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  nextWaypoint: string;
  estimatedArrival: string;
  timestamp: string;
}

export function simulateLiveGpsStream(
  onFrame: (frame: BusTelemetryFrame) => void
): () => void {
  let lat = -0.180653;
  let lng = -78.467834;
  let speed = 76.5;

  const interval = setInterval(() => {
    // Smooth step southward along the Andes highway
    lat -= 0.0015;
    lng += 0.0008;
    speed = Math.max(50, Math.min(88, speed + (Math.random() * 4 - 2)));

    onFrame({
      tripId: "trip_4021",
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      speedKmh: Number(speed.toFixed(1)),
      nextWaypoint: "Santo Domingo de los Tsáchilas",
      estimatedArrival: "04:15 AM",
      timestamp: new Date().toLocaleTimeString(),
    });
  }, 2000);

  return () => clearInterval(interval);
}
