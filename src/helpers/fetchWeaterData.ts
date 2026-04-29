export async function fetchWeatherData(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,apparent_temperature,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&timezone=auto&past_days=0&forecast_days=7`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}
