import { useEffect } from "react";
import { useRoute } from "../../contexts/RouteContext";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { green, red, yellow } from "../../config/colors";
import { lineString } from "@turf/turf";

function MapWeatherWaypoints() {
  const { data, gpxLines, weatherFetchPoints } = useRoute();
  const map = useMap();

  useEffect(() => {
    if (!data.length || !gpxLines.length || !weatherFetchPoints.length) return;

    console.log(weatherFetchPoints);

    // TODO: handle loop routes where first and last GPX coordinate are the same -> differentiate between loops and "normal" routes via if/els
    const line = lineString(gpxLines);

    const segments = weatherFetchPoints.slice(0, -1).map((point, i) => {
      const start = point;
      const end = weatherFetchPoints[i + 1];
    });

    const markers = data.map((point) => {
      if (!point.coord) return null;
      const [lon, lat] = point.coord;

      // Leaflet expects latitude, longitude
      return L.circleMarker([lat, lon], {
        radius: 6,
        fillColor:
          point.verdict === "green"
            ? green
            : point.verdict === "yellow"
              ? yellow
              : red,
        color: "#000",
        weight: 1,
        fillOpacity: 0.9,
      }).addTo(map);
    });

    return () => {
      markers.forEach((m) => m?.remove());
    };
  }, [data, map, gpxLines, weatherFetchPoints]);

  return <div></div>;
}

export default MapWeatherWaypoints;
