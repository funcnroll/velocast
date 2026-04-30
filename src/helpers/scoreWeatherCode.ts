import type { WeatherCodeResult } from "../types/WeatherCodeResult";

export function scoreWeatherCode(code: number): WeatherCodeResult {
  // https://open-meteo.com/en/docs#weather_variable_documentation
  switch (code) {
    // Clear sky / mainly clear
    case 0:
    case 1:
      return {
        verdict: "green",
        message: "Clear skies. Great conditions for cycling!",
      };

    // Partly cloudy / overcast
    case 2:
    case 3:
      return { verdict: "yellow", message: "Cloudy but dry. Cycling is fine." };

    // Fog
    case 45:
    case 48:
      return {
        verdict: "yellow",
        message: "Foggy conditions. Take care, visibility is reduced.",
      };

    // Light / moderate drizzle
    case 51:
    case 53:
      return {
        verdict: "yellow",
        message: "Light/moderate drizzle. Roads may be slippery.",
        score: -10,
      };

    // Heavy drizzle
    case 55:
      return {
        verdict: "red",
        message: "Heavy drizzle. Not ideal for cycling.",
      };

    // Freezing drizzle
    case 56:
    case 57:
      return {
        verdict: "red",
        message: "Freezing drizzle. Risk of ice on roads, avoid cycling.",
      };

    // Slight rain
    case 61:
      return {
        verdict: "yellow",
        message: "Slight rain. Dress accordingly.",
      };

    // Moderate / heavy rain
    case 63:
    case 65:
      return {
        verdict: "red",
        message: "Moderate to heavy rain. Poor cycling conditions.",
      };

    // Freezing rain
    case 66:
    case 67:
      return {
        verdict: "red",
        message: "Freezing rain. Dangerous, avoid cycling.",
      };

    // Snow
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        verdict: "red",
        message: "Snowfall. Roads are likely hazardous.",
      };

    // Light / moderate rain showers
    case 80:
    case 81:
      return {
        verdict: "yellow",
        message: "Rain showers. May pass quickly, but expect wet roads.",
      };

    // Violent rain showers
    case 82:
      return {
        verdict: "red",
        message: "Violent rain showers. Not safe for cycling.",
      };

    // Snow showers
    case 85:
    case 86:
      return { verdict: "red", message: "Snow showers. Avoid cycling." };

    // Thunderstorms
    case 95:
    case 96:
    case 99:
      return { verdict: "red", message: "Thunderstorm. Do not cycle." };

    default:
      return { verdict: "green", message: "Conditions look good for cycling." };
  }
}
