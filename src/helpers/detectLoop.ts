import type { LatLon } from "../types/LatLon";

export function detectLoop(waypoints: { coord: LatLon }[]): boolean {
  const first = waypoints[0].coord;
  const last = waypoints[waypoints.length - 1].coord;
  const latDiff = Math.abs(first[0] - last[0]);
  const lonDiff = Math.abs(first[1] - last[1]);
  // ~0.0005 degrees ≈ 50 metres
  return latDiff < 0.0005 && lonDiff < 0.0005;
}
