import type { LatLon } from "./LatLon";

export type Waypoint = {
  coord: LatLon;

  distanceKm?: number;
  eta?: Date;

  weather?: {
    windSpeedkmH: number;
    windDirection: number;
    beaufortScale: number;
    temperatureC: number;
    rain: number;
  };
};
