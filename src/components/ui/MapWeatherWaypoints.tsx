import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { green, red, white, yellow } from "../../config/colors";
import { lineSlice, lineString } from "@turf/turf";
import { useRoute } from "../../hooks/useRoute";
import { intervalKm } from "../../config/intervalKm";

function MapWeatherWaypoints() {
  const {
    data,
    gpxLines,
    weatherFetchPoints,
    setSelectedSegmentIndex,
    setError,
  } = useRoute();
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

    //Routes shorter than intervalKm only produce one weatherFetchPoint,
    // which means there are no segments to slice or draw. Open-Meteo data is also
    // only accurate down to ~10km intervals, so short routes wouldn't give
    // meaningful weather insights in the first place
    if (weatherFetchPoints.length < 2) {
      setError(`Route too short - upload a route of at least ${intervalKm}km`);
      return;
    }

    const line = lineString(gpxLines);

    // Loop routes: last segment (final waypoint back to start) is not drawn
    // lineSlice can't go backwards along the line and the two-slice workaround
    // adds complexity which is not worth the payoff.
    const segments = weatherFetchPoints.slice(0, -1).map((point, i) => {
      const start = point;
      const end = weatherFetchPoints[i + 1];
      const sliced = lineSlice(start, end, line);
      return { sliced, verdict: data[i].verdict };
    });

    // Visual separation between each waypoint. Not necessarily pretty, but it works
    const markers = weatherFetchPoints.map((point) => {
      const [lon, lat] = point.geometry.coordinates;
      return L.circleMarker([lat, lon], {
        radius: 6,
        color: white,
        fillColor: white,
        fillOpacity: 1,
        weight: 2,
        pane: "markerPane",
      }).addTo(map);
    });

    // The waypoint lines themselves
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
        .on("click", () => setSelectedSegmentIndex(i))

        .addTo(map);
    });

    return () => {
      setError("");
      polylines.forEach((p) => p.remove());
      markers.forEach((m) => m.remove());
    };
  }, [
    data,
    map,
    gpxLines,
    weatherFetchPoints,
    setSelectedSegmentIndex,
    setError,
  ]);

  return null;
}

export default MapWeatherWaypoints;
