import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { green, red, yellow } from "../../config/colors";
import { lineSlice, lineString } from "@turf/turf";
import { useRoute } from "../../hooks/useRoute";

function MapWeatherWaypoints() {
  const { data, gpxLines, weatherFetchPoints, setSidebarData, setError } =
    useRoute();
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

    //Routes shorter than intervalKm (15km) only produce one weatherFetchPoint,
    // which means there are no segments to slice or draw. Open-Meteo data is also
    // only accurate down to ~10km intervals, so short routes wouldn't give
    // meaningful weather insights in the first place
    if (weatherFetchPoints.length < 2) {
      setError("Route too short - upload a route of at least 15km");
      return;
    }

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
  }, [data, map, gpxLines, weatherFetchPoints, setSidebarData, setError]);

  return <div></div>;
}

export default MapWeatherWaypoints;
