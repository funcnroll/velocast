type LatLng = [number, number];

export type Waypoint = {
  coord: LatLng;

  // TODO: calculate properties and make them required later
  distanceKm?: number;
  ETA?: Date;

  weather?: {
    windSpeedkmH: number;
    windDirection: number;
    beaufortScale: number;
    temperatureC: number;
    rain: number;
  };
};
