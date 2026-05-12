import type { LatLon } from "./LatLon";

export type Waypoint = {
  coord: LatLon;

  weather?: {
    windSpeedkmH: number;
    windDirection: number;
    beaufortScale: number;
    temperatureC: number;
    rain: number;
  };
};
