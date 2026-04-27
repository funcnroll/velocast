import { parseGPX } from "@we-gold/gpxjs";

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
        return { lat: point.latitude, lng: point.longitude };
      }),
    );

    const distance = tracks?.map((track) => track.distance.total);

    console.log(points);
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
