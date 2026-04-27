type LatLng = [number, number];

export type Waypoint = {
  coord: LatLng;

  distanceKm: number;
  ETA: Date;

  weather?: {
    windSpeedkmH: number;
    windDirection: number;
    beaufortScale: number;
    temperatureC: number;
    rain: number;
  };
};
