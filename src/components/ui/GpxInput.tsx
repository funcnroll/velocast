import { parseGPX } from "@we-gold/gpxjs";
import { createWaypoints } from "../../helpers/createWaypoints";

export function GpxInput() {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const gpxText = await file.text();

    const [parsedFile, error] = parseGPX(gpxText);

    if (error) console.error(error);

    console.log(parsedFile);

    const tracks = parsedFile?.tracks;

    const points = tracks?.map((track) =>
      track.points.map((point) => {
        return { lat: point.latitude, lon: point.longitude };
      }),
    );

    const distance = tracks?.map((track) => track.distance.total);

    console.log(points);
    console.log(distance);

    const waypoints = createWaypoints(points[0]);

    console.log(waypoints);
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
