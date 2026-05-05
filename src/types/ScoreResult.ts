import type { LatLon } from "./LatLon";
import type { WeatherData } from "./WeatherData";

export type ScoreResult = {
  score: number;
  verdict: "green" | "yellow" | "red";
  message: string;
  breakdown?: WeatherData;
  coord?: LatLon; //  Point of the intervalKm
  eta?: Date;
};
