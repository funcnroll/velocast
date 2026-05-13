import { profileConfig } from "../config/riderProfile";
import type { RiderProfileType } from "../types/RiderProfileType";
import type { ScoreResult } from "../types/ScoreResult";
import type { WeatherData } from "../types/WeatherData";
import { scoreWeatherCode } from "./scoreWeatherCode";
import { calculateScorePenalty } from "./calculateScorePenalty";
import type { AdvisoryMessage } from "../types/AdvisoryMessage";

export function scoreWeatherConditions(
  weatherData: WeatherData,
  profile: RiderProfileType,
): ScoreResult {
  const {
    apparent_temp,
    precipitation_probability,
    rain,
    weather_code,
    wind_speed_10m,
    wind_gusts_10m,
    uv_index,
    wind_direction_10m,
  } = weatherData;

  const { windMultiplier, tempMultiplier, rainMultiplier } =
    profileConfig[profile];

  let score = 100;
  let message: string | AdvisoryMessage[] = "";
  const messages: AdvisoryMessage[] = [];

  const breakdown = {
    apparent_temp,
    precipitation_probability,
    rain,
    weather_code,
    wind_speed_10m,
    wind_gusts_10m,
    uv_index,
    wind_direction_10m,
  };

  //  Weather code (hard override)
  const codeResult = scoreWeatherCode(weather_code);
  if (codeResult.verdict === "red") {
    return { score: 0, verdict: "red", message: codeResult.message, breakdown };
  }

  // Yellow codes reduce score but allow individual codes to influence final verdict
  if (codeResult.verdict === "yellow") {
    messages.push({ text: codeResult.message, severity: "yellow" });
    // Scores are negative, so += decreases the score (-= would increase it)
    if (codeResult.score) score += codeResult.score;
  }

  //  Wind speed (max 60 points, unless too fast)
  if (wind_speed_10m > 60) {
    return {
      score: 0,
      verdict: "red",
      message: "Dangerous wind speeds. Riding not recommended.",
      breakdown,
    };
  }
  const windPenalty = calculateScorePenalty(
    Math.min(wind_speed_10m, 40),
    40,
    1.3,
    60,
    windMultiplier,
  );
  score -= windPenalty;

  if (wind_speed_10m > 30)
    messages.push({
      text: "Strong winds. Expect resistance.",
      severity: "yellow",
    });
  else if (wind_speed_10m > 15)
    messages.push({ text: "Moderate winds.", severity: "info" });

  //  Wind gusts (max 30 points)
  const gustPenalty = calculateScorePenalty(
    Math.min(wind_gusts_10m, 80),
    80,
    1.4,
    30,
    windMultiplier,
  );
  score -= gustPenalty;

  if (wind_gusts_10m > 50)
    messages.push({
      text: "Dangerous gusts. Stay alert or reconsider.",
      severity: "red",
    });
  else if (wind_gusts_10m > 35)
    messages.push({ text: "Occasional strong gusts.", severity: "yellow" });

  //  Apparent temperature (max 40 points)
  // Accounting for cold and heat separately
  // Penalty for cold is designed to be more gradual as cold can be manageable with the right gear, whereas heat can become dangerous more quickly
  // No penalty between 12 - 23 degrees.
  if (apparent_temp < 12) {
    score -= calculateScorePenalty(
      12 - apparent_temp,
      20,
      1.8,
      40,
      tempMultiplier,
    );
  } else if (apparent_temp > 23) {
    score -= calculateScorePenalty(
      apparent_temp - 23,
      30,
      1.5,
      30,
      tempMultiplier,
    );
  }

  if (apparent_temp < 5)
    messages.push({ text: "Very cold. Layer up.", severity: "red" });
  else if (apparent_temp < 10)
    messages.push({
      text: "Cold. A jacket is recommended.",
      severity: "yellow",
    });
  else if (apparent_temp > 10 && apparent_temp < 12)
    messages.push({
      text: "Slightly cool. Consider a light layer.",
      severity: "info",
    });
  else if (apparent_temp > 30)
    messages.push({ text: "Very hot. Stay hydrated.", severity: "red" });
  else if (apparent_temp > 23)
    messages.push({ text: "Warm. Stay hydrated.", severity: "yellow" });

  //  Rain (max 20 points)
  const rainPenalty = calculateScorePenalty(
    Math.min(rain, 10),
    10,
    1.2,
    20,
    rainMultiplier,
  );
  score -= rainPenalty;

  if (rain >= 5)
    messages.push({ text: "Heavy rain. Very wet roads.", severity: "red" });
  else if (rain >= 1.5 && codeResult.verdict === "green")
    messages.push({ text: "Moderate rain.", severity: "yellow" });
  else if (rain > 0 && codeResult.verdict === "green")
    messages.push({
      text: "Light rain. Roads may be slippery.",
      severity: "info",
    });

  //  Precipitation probability (max 10 points)
  // If no rain is recorded, there may still theoretically be a precipitation chance.
  if (rain === 0 && codeResult.verdict === "green") {
    const precipPenalty = calculateScorePenalty(
      precipitation_probability,
      100,
      1.4,
      10,
      rainMultiplier,
    );
    score -= precipPenalty;

    if (precipitation_probability > 70)
      messages.push({
        text: "High chance of rain. Consider waterproofs.",
        severity: "yellow",
      });
    else if (precipitation_probability > 40)
      messages.push({ text: "Some chance of rain.", severity: "info" });
  }

  //  UV advisory (no score impact)
  if (uv_index >= 8)
    messages.push({
      text: "Very high UV. Sun protection essential.",
      severity: "red",
    });
  else if (uv_index >= 6)
    messages.push({ text: "High UV. Consider sunscreen.", severity: "yellow" });
  else if (uv_index >= 3)
    messages.push({
      text: "Moderate UV. Consider sunscreen.",
      severity: "info",
    });

  // clamp score between 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  const verdict: "green" | "yellow" | "red" =
    score >= 75 ? "green" : score >= 40 ? "yellow" : "red";

  if (messages.length > 0) {
    message = messages;
  }

  // handling edge cases
  // red
  if (messages.length === 0 && verdict !== "green" && verdict === "red") {
    message = `Poor conditions overall. Consider postponing.`;
  }

  // yellow
  if (messages.length === 0 && verdict !== "green" && verdict !== "red") {
    message = `Combination of mild to moderate adverse factors.`;
  }

  // green
  if (messages.length === 0 && verdict === "green") {
    message = "No issues found.";
  }

  return { score, verdict, message, breakdown };
}
