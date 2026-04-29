import { formatInTimeZone } from "date-fns-tz";
import { roundToNearestHours } from "date-fns/fp/roundToNearestHours";

export async function fetchWeatherData(lat: number, lon: number, eta: Date) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,apparent_temperature,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&timezone=auto&past_days=0&forecast_days=7`;

  const response = await fetch(url);
  const data = await response.json();
  const timezone = data.timezone as string;

  const dateStringRounded = roundToNearestHours(eta);

  const hourlyMatch = data.hourly.time.indexOf(
    formatInTimeZone(dateStringRounded, timezone, "yyyy-MM-dd'T'HH:mm"),
  );

  const hourlyMatchWeatherData = {
    actual_temp: data.hourly.temperature_2m[hourlyMatch],
    apparent_temp: data.hourly.apparent_temperature[hourlyMatch],
    precipitation_probability:
      data.hourly.precipitation_probability[hourlyMatch],
    rain: data.hourly.rain[hourlyMatch],
    weather_code: data.hourly.weather_code[hourlyMatch],
    wind_speed_10m: data.hourly.wind_speed_10m[hourlyMatch],
    wind_direction_10m: data.hourly.wind_direction_10m[hourlyMatch],
    wind_gusts_10m: data.hourly.wind_gusts_10m[hourlyMatch],
    uv_index: data.hourly.uv_index[hourlyMatch],
  };

  return hourlyMatchWeatherData;
}
