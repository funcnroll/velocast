import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-gpx";
import { useRoute } from "../../contexts/RouteContext";
import { green } from "../../config/colors";

export default function GpxLayer() {
  const { gpxUrl } = useRoute();

  const map = useMap();

  useEffect(() => {
    const gpx = new (L as any).GPX(gpxUrl, {
      async: true,
      polyline_options: {
        color: green,
        weight: 4,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      },
      marker_options: {
        startIconUrl: "",
        endIconUrl: "",
        shadowUrl: "",
      },
    }).on("loaded", (e: any) => {
      map.fitBounds(e.target.getBounds(), { padding: [40, 40] });
    });

    gpx.addTo(map);

    return () => {
      map.removeLayer(gpx);
    };
  }, [map, gpxUrl]);

  return null;
}
