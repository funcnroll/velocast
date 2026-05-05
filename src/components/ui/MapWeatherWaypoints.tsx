import { useEffect } from "react";
import { useRoute } from "../../contexts/RouteContext";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { green, red, yellow } from "../../config/colors";
import { lineSlice, lineString } from "@turf/turf";
import type { LatLon } from "../../types/LatLon";

function MapWeatherWaypoints() {
  const { data, gpxLines, weatherFetchPoints, setSidebarData } = useRoute();
  const map = useMap();

  useEffect(() => {
    if (
      !data.length ||
      !gpxLines ||
      !gpxLines.length ||
      !weatherFetchPoints.length ||
      data.length !== weatherFetchPoints.length
    )
      return;

    // TODO: handle loop routes
    // TODO: handle routes shorter than intervalKm
    const line = lineString(gpxLines);

    const segments = weatherFetchPoints.slice(0, -1).map((point, i) => {
      const start = point;
      const end = weatherFetchPoints[i + 1];
      const sliced = lineSlice(start, end, line);
      return { sliced, verdict: data[i].verdict };
    });

    const polylines = segments.map(({ sliced, verdict }, i) => {
      const coords = sliced.geometry.coordinates.map(
        ([lon, lat]) => [lat, lon] as [number, number],
      );
      return L.polyline(coords, {
        color:
          verdict === "green" ? green : verdict === "yellow" ? yellow : red,
        weight: 6,
        opacity: 1,
      })
        .on("click", () => setSidebarData(data[i]))
        .addTo(map);
    });

    return () => {
      polylines.forEach((p) => p.remove());
    };
  }, [data, map, gpxLines, weatherFetchPoints, setSidebarData]);

  return <div></div>;
}

export default MapWeatherWaypoints;
