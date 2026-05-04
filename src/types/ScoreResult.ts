import type { LatLon } from "./LatLon";

export type ScoreResult = {
  score: number;
  verdict: "green" | "yellow" | "red";
  message: string;
  waypointIndex?: number; // Each index represents each intervalKm, i.e. [0] = 10, [1] = 20
  coord?: LatLon; //  Point of the intervalKm
};
