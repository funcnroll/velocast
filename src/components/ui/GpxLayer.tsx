import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-gpx";
import { useRoute } from "../../hooks/useRoute";

export default function GpxLayer() {
  const { gpxUrl } = useRoute();

  const map = useMap();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gpx = new (L as any).GPX(gpxUrl, {
      async: true,
      polyline_options: {
        opacity: 0,
        color: "transparent",
      },
      marker_options: {
        startIconUrl: "",
        endIconUrl: "",
        shadowUrl: "",
        wptIconUrls: { "": "" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
