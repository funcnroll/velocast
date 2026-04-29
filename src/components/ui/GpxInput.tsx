import { useRoute } from "../../contexts/RouteContext";
import { parseDistanceToFetchPoints } from "../../helpers/parseDistanceToFetchPoints";
import { processGpx } from "../../helpers/processGpx";
import { lineString, along } from "@turf/turf";

export function GpxInput() {
  const { setWeatherFetchPoints, setDistance } = useRoute();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const gpxText = await file.text();

    const { waypoints, distance } = processGpx(gpxText);

    setDistance(distance);
    const line = lineString(waypoints.map((wp) => wp.coord));

    const weatherFetchPointsArr = parseDistanceToFetchPoints(distance, line);

    setWeatherFetchPoints(weatherFetchPointsArr);
  }

  return (
    <input
      type="file"
      accept=".gpx"
      onChange={handleFileChange}
    />
  );
}

export default GpxInput;
