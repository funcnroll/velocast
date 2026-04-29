import type { WeatherData } from "../types/WeatherData";

export function scoreWeatherConditions(weatherData: WeatherData) {
  const {
    actual_temp,
    precipitation_probability,
    rain,
    weather_code,
    wind_speed_10m,
    uv_index,
  } = weatherData;

  let score = 100; // 100 = perfect conditions
}
