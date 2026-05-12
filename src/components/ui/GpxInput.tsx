import { parseDistanceToFetchPoints } from "../../helpers/parseDistanceToFetchPoints";
import { processGpx } from "../../helpers/processGpx";
import { lineString } from "@turf/turf";
import { useRoute } from "../../hooks/useRoute";
import type { LatLon } from "../../types/LatLon";
import { useState } from "react";
import { detectLoop } from "../../helpers/detectLoop";

export function GpxInput() {
  const {
    setWeatherFetchPoints,
    setDistance,
    setGpxUrl,
    setGpxLines,
    setError,
    gpxLines,
    setSelectedSegmentIndex,
  } = useRoute();

  const [isLoopRoute, setIsLoopRoute] = useState(false);
  const [templateRouteLoaded, setTemplateRouteLoaded] = useState(false);

  async function handleLoadTemplate() {
    try {
      const response = await fetch("/templateMap.gpx");

      if (!response.ok) {
        setError("Failed to load template GPX");
        return;
      }

      const blob = await response.blob();

      const file = new File([blob], "templateMap.gpx", {
        type: "application/gpx+xml",
      });

      await handleFileChange(undefined, file);

      setTemplateRouteLoaded(true);
    } catch {
      setError("Failed to load template GPX");
    }
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    templateFile?: File,
  ) {
    const file = templateFile || e.target.files?.[0];
    if (!file) return;

    if (!templateFile) {
      setTemplateRouteLoaded(false);
    }

    try {
      const gpxText = await file.text();

      if (!gpxText || !gpxText.length) {
        setError("Invalid GPX file");
        return;
      }

      const { waypoints, distance } = processGpx(gpxText);

      if (!waypoints.length) {
        setError("GPX file contains no track points");
        return;
      }

      setError("");
      setSelectedSegmentIndex(0);
      setIsLoopRoute(detectLoop(waypoints));

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
    <div>
      <label
        className={`flex flex-col items-center justify-center gap-2 w-full py-6 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
          gpxLines
            ? "border-zinc-600 bg-zinc-800/30"
            : "border-zinc-600 bg-zinc-800/50 hover:border-zinc-400 hover:bg-zinc-800"
        }`}
      >
        {/* https://heroicons.com/outline  arrow-up-tray */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-zinc-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>

        <p className="text-sm text-zinc-400">
          {gpxLines ? "Route loaded - click to replace" : "Upload GPX file"}
        </p>
        <input
          type="file"
          accept=".gpx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {!templateRouteLoaded && (
        <button
          type="button"
          onClick={handleLoadTemplate}
          className="w-full py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors text-sm text-zinc-200 cursor-pointer mt-4"
        >
          Load template route
        </button>
      )}

      {isLoopRoute && (
        <p className="text-xs text-zinc-500 mt-3">
          Loop route detected. The final segment back to the start is not
          visualised.
        </p>
      )}
    </div>
  );
}

export default GpxInput;
