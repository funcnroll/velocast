import { profileConfig } from "../config/riderProfile";
import type { RiderProfileType } from "../types/RiderProfileType";
import type { ScoreResult } from "../types/ScoreResult";
import type { WeatherData } from "../types/WeatherData";
import { scoreWeatherCode } from "./scoreWeatherCode";
import { calculateScorePenalty } from "./calculateScorePenalty";

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
  } = weatherData;

  const { windMultiplier, tempMultiplier, rainMultiplier } =
    profileConfig[profile];

  let score = 100;
  const messages: string[] = [];

  //  Weather code (hard override)
  const codeResult = scoreWeatherCode(weather_code);
  if (codeResult.verdict === "red") {
    return { score: 0, verdict: "red", message: codeResult.message };
  }

  // Yellow codes reduce score but allow individual codes to influence final verdict
  if (codeResult.verdict === "yellow" && codeResult.score) {
    score -= codeResult.score;
    messages.push(codeResult.message);
  }

  //  Wind speed (max 60 points, unless too fast)
  if (wind_speed_10m > 60) {
    return {
      score: 0,
      verdict: "red",
      message: "Dangerous wind speeds. Riding not recommended.",
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

  if (wind_speed_10m > 30) messages.push("Strong winds. Expect resistance.");
  else if (wind_speed_10m > 15) messages.push("Moderate winds.");

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
    messages.push("Dangerous gusts. Stay alert or reconsider.");
  else if (wind_gusts_10m > 35) messages.push("Occasional strong gusts.");

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

  if (apparent_temp < 5) messages.push("Very cold. Layer up.");
  else if (apparent_temp < 10) messages.push("Cold. A jacket is recommended.");
  else if (apparent_temp > 10 && apparent_temp < 12)
    messages.push("Slightly cool. Consider a light layer");
  else if (apparent_temp > 30) messages.push("Very hot. Stay hydrated.");
  else if (apparent_temp > 23) messages.push("Warm. Stay hydrated.");

  //  Rain (max 20 points)
  const rainPenalty = calculateScorePenalty(
    Math.min(rain, 10),
    10,
    1.2,
    20,
    rainMultiplier,
  );
  score -= rainPenalty;

  if (rain > 5) messages.push("Heavy rain. Very wet roads.");
  else if (rain > 2) messages.push("Moderate rain.");
  else if (rain > 0) messages.push("Light rain. Roads may be slippery.");

  //  Precipitation probability (max 10 points)
  // If no rain is recorded, there may still theoretically be a precipitation chance.
  if (rain === 0) {
    const precipPenalty = calculateScorePenalty(
      precipitation_probability,
      100,
      1.4,
      10,
      rainMultiplier,
    );
    score -= precipPenalty;
  }

  if (precipitation_probability > 70)
    messages.push("High chance of rain. Consider waterproofs.");
  else if (precipitation_probability > 40)
    messages.push("Some chance of rain.");

  //  UV advisory (no score impact)
  if (uv_index >= 8) messages.push("Very high UV. Sun protection essential.");
  else if (uv_index >= 6) messages.push("High UV. Consider sunscreen.");
  else if (uv_index >= 3) messages.push("Moderate UV. Consider sunscreen.");

  // clamp score between 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  const verdict: "green" | "yellow" | "red" =
    score >= 75 ? "green" : score >= 40 ? "yellow" : "red";

  const message =
    messages.length > 0 ? messages.join(" ") : "Great conditions for cycling!";

  return { score, verdict, message };
}
