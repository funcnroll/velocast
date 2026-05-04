import type { LatLon } from "./LatLon";

export type Waypoint = {
  coord: LatLon;

  // TODO: calculate properties and make them required later
  distanceKm?: number;
  eta: Date;

  weather?: {
    windSpeedkmH: number;
    windDirection: number;
    beaufortScale: number;
    temperatureC: number;
    rain: number;
  };
};
