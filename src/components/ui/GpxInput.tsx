import { processGpx } from "../../helpers/processGpx";

export function GpxInput() {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const gpxText = await file.text();

    const { waypoints, distance } = processGpx(gpxText);

    console.log(waypoints);
    console.log(distance);
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
