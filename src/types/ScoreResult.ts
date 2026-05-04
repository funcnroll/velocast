import type { LatLon } from "./LatLon";

export type ScoreResult = {
  score: number;
  verdict: "green" | "yellow" | "red";
  message: string;
  coord?: LatLon; //  Point of the intervalKm
};
