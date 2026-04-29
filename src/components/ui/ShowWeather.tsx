import { useRoute } from "../../contexts/RouteContext";

function ShowWeather() {
  const { etaArr } = useRoute();

  console.log(etaArr);

  return <div></div>;
}

export default ShowWeather;
