import { processGpx } from "../../helpers/processGpx";
import { lineString, along } from "@turf/turf";

export function GpxInput() {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const gpxText = await file.text();

    const { waypoints, distance } = processGpx(gpxText);

    const line = lineString(waypoints.map((wp) => wp.coord));

    console.log(line);

    let currentDistanceinKm = 0;
    const gpxDistanceInKm = distance / 1000;
    const weatherFetchPoints = [];

    while (currentDistanceinKm < gpxDistanceInKm) {
      const currentPoint = along(line, currentDistanceinKm);
      weatherFetchPoints.push(currentPoint);
      currentDistanceinKm += 5;
    }

    console.log(weatherFetchPoints);
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
