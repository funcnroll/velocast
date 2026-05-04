import { useEffect } from "react";
import { useRoute } from "../../contexts/RouteContext";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { green, red, yellow } from "../../config/colors";
import { lineSlice, lineString } from "@turf/turf";

function MapWeatherWaypoints() {
  const { data, gpxLines, weatherFetchPoints } = useRoute();
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
    console.log(weatherFetchPoints);

    // TODO: handle loop routes where first and last GPX coordinate are the same -> differentiate between loops and "normal" routes via if/else
    // TODO: handle routes shorter than intervalKm -> if/else
    const line = lineString(gpxLines);

    // Divide each weatherFetchPoint into its own slice
    const segments = weatherFetchPoints.slice(0, -1).map((point, i) => {
      const start = point;
      const end = weatherFetchPoints[i + 1];

      const sliced = lineSlice(start, end, line);

      return { sliced, verdict: data[i].verdict };
    });

    console.log(segments);

    const polylines = segments.map(({ sliced, verdict }) => {
      const coords = sliced.geometry.coordinates.map(
        ([lon, lat]) => [lat, lon] as [number, number],
      );
      return L.polyline(coords, {
        color:
          verdict === "green" ? green : verdict === "yellow" ? yellow : red,
        weight: 4,
        opacity: 1,
      }).addTo(map);
    });

    return () => {
      polylines.forEach((p) => p.remove());
    };
  }, [data, map, gpxLines, weatherFetchPoints]);

  return <div></div>;
}

export default MapWeatherWaypoints;
