import { useRoute } from "../../contexts/RouteContext";
import { roundToNearestHours } from "date-fns";
import { fetchWeatherData } from "../../helpers/fetchWeatherData";
import { useEffect } from "react";

function ShowWeather() {
  const { etaArr } = useRoute();

  console.log(etaArr);

  useEffect(() => {
    if (!etaArr.length) return;
    const string = roundToNearestHours(etaArr[0].eta!);

    async function fetchData() {
      const data = await fetchWeatherData(
        etaArr[0].coord[0],
        etaArr[0].coord[1],
      );
      console.log(data);

      const hourlyMatch = data.hourly.time.indexOf(
        string.toISOString().slice(0, 16),
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

      console.log(hourlyMatchWeatherData);
    }
    fetchData();
  }, [etaArr]);

  return <div></div>;
}

export default ShowWeather;
