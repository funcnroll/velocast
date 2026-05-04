import { along } from "@turf/turf";
import type { Feature, LineString } from "geojson";
import { intervalKm } from "../config/intervalKm";

export function parseDistanceToFetchPoints(
  distance: number,
  line: Feature<LineString>,
) {
  let currentDistanceinKm = 0;
  const gpxDistanceInKm = distance / 1000;
  const weatherFetchPointsArr = [];

  while (currentDistanceinKm < gpxDistanceInKm) {
    const currentPoint = along(line, currentDistanceinKm);
    weatherFetchPointsArr.push(currentPoint);
    // TODO: make the interval dynamic based off route length
    currentDistanceinKm += intervalKm;
  }

  return weatherFetchPointsArr;
}
