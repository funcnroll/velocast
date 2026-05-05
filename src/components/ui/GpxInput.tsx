import { parseDistanceToFetchPoints } from "../../helpers/parseDistanceToFetchPoints";
import { processGpx } from "../../helpers/processGpx";
import { lineString } from "@turf/turf";
import { useRoute } from "../../hooks/useRoute";
import type { LatLon } from "../../types/LatLon";

export function GpxInput() {
  const {
    setWeatherFetchPoints,
    setDistance,
    setGpxUrl,
    setGpxLines,
    setError,
  } = useRoute();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const gpxText = await file.text();

      if (!gpxText || !gpxText.length) {
        setError("Invalid GPX File");
        return;
      }

      const { waypoints, distance } = processGpx(gpxText);

      if (!waypoints.length) {
        setError("GPX file contains no track points");
        return;
      }

      setDistance(distance);
      setGpxUrl(URL.createObjectURL(file));

      const line = lineString(waypoints.map((wp) => wp.coord));

      setGpxLines(line.geometry.coordinates as LatLon[]);

      const weatherFetchPointsArr = parseDistanceToFetchPoints(distance, line);

      setWeatherFetchPoints(weatherFetchPointsArr);
    } catch {
      setError("Failed to parse GPX file. Make sure it's a valid GPX");
    }
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
