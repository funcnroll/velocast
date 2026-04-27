import { parseGPX } from "@we-gold/gpxjs";
import { createWaypoints } from "./createWaypoints";

export function processGpx(gpxText: string) {
  const [parsedFile, error] = parseGPX(gpxText);

  if (error) throw error;
  console.log(parsedFile);

  const track = parsedFile?.tracks[0];

  if (!track) return { waypoints: [], distance: 0 };

  const points = track.points.map((point) => ({
    lat: point.latitude,
    lon: point.longitude,
  }));

  const distance = track.distance.total;

  console.log(points);
  console.log(distance);

  const waypoints = createWaypoints(points);

  return { waypoints, distance };
}
