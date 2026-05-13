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

  // Sampling each fetch point along fixed intervals
  while (currentDistanceinKm < gpxDistanceInKm) {
    const currentPoint = along(line, currentDistanceinKm);
    weatherFetchPointsArr.push(currentPoint);
    currentDistanceinKm += intervalKm;
  }

  return weatherFetchPointsArr;
}
