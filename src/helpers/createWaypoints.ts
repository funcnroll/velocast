import type { Waypoint } from "../types/Waypoint";

export function createWaypoints(pointArr: { lat: number; lon: number }[]) {
  const waypoints: Waypoint[] = pointArr.map((point) => {
    // Turf expects longitude, latitude
    return { coord: [point.lon, point.lat] };
  });

  return waypoints;
}
