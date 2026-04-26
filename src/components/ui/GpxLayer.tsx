import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-gpx";

interface Props {
  url: string;
}

export default function GpxLayer({ url }: Props) {
  const map = useMap();

  useEffect(() => {
    const gpx = new (L as any).GPX(url, {
      async: true,
      polyline_options: {
        color: "#4ade80",
        weight: 3,
        lineCap: "round",
      },
      marker_options: {
        startIconUrl: "",
        endIconUrl: "",
        shadowUrl: "",
      },
    }).on("loaded", (e: any) => {
      map.fitBounds(e.target.getBounds());
    });

    gpx.addTo(map);

    return () => {
      map.removeLayer(gpx);
    };
  }, [map, url]);

  return null;
}
