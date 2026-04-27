import type { Waypoint } from "../types/Waypoint";

export function createWaypoints(pointArr: { lat: number; lon: number }[]) {
  const waypoints: Waypoint[] = pointArr.map((point) => {
    return { coord: [point.lat, point.lon] };
  });

  return waypoints;
}
