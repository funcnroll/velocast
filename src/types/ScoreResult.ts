export type ScoreResult = {
  score: number;
  verdict: "green" | "yellow" | "red";
  message: string;
};
