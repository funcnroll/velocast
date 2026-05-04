import { parseGPX } from "@we-gold/gpxjs";
import { createWaypoints } from "./createWaypoints";

export function processGpx(gpxText: string) {
  const [parsedFile, error] = parseGPX(gpxText);

  if (error) throw error;

  const track = parsedFile?.tracks[0];

  if (!track) return { waypoints: [], distance: 0 };

  const points = track.points.map((point) => ({
    lon: point.longitude,
    lat: point.latitude,
  }));

  const distance = track.distance.total;

  const waypoints = createWaypoints(points);

  return { waypoints, distance };
}
