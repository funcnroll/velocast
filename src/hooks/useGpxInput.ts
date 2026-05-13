import { lineString } from "@turf/turf";
import { parseDistanceToFetchPoints } from "../helpers/parseDistanceToFetchPoints";
import { detectLoop } from "../helpers/detectLoop";
import { processGpx } from "../helpers/processGpx";
import { useState } from "react";
import { useRoute } from "./useRoute";
import type { LatLon } from "../types/LatLon";

export function useGpxInput() {
  const {
    setWeatherFetchPoints,
    setDistance,
    setGpxUrl,
    setGpxLines,
    setError,
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

      await handleFileChange(undefined!, file);

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

  return {
    isLoopRoute,
    templateRouteLoaded,
    handleLoadTemplate,
    handleFileChange,
  };
}
