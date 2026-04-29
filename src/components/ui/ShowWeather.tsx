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

      console.log(hourlyMatch);
    }
    fetchData();
  }, [etaArr]);

  return <div></div>;
}

export default ShowWeather;
