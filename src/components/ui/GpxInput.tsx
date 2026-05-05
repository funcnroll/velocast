import { parseDistanceToFetchPoints } from "../../helpers/parseDistanceToFetchPoints";
import { processGpx } from "../../helpers/processGpx";
import { lineString } from "@turf/turf";
import { useRoute } from "../../hooks/useRoute";
import type { LatLon } from "../../types/LatLon";

export function GpxInput() {
  const { setWeatherFetchPoints, setDistance, setGpxUrl, setGpxLines } =
    useRoute();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const gpxText = await file.text();

    const { waypoints, distance } = processGpx(gpxText);

    setDistance(distance);
    setGpxUrl(URL.createObjectURL(file));

    const line = lineString(waypoints.map((wp) => wp.coord));

    setGpxLines(line.geometry.coordinates as LatLon[]);

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
