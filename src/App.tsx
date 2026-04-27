import { MapContainer, TileLayer } from "react-leaflet";
import GpxLayer from "./components/ui/GpxLayer";
import GpxInput from "./components/ui/GpxInput";

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-zinc-900">
      <div className="flex-1">
        <MapContainer
          zoom={12}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          />
          <GpxLayer url="/templateMap.gpx" />
        </MapContainer>
      </div>

      <div className="w-80 bg-zinc-800 border-l border-zinc-700 p-4">
        <p className="text-white text-sm">
          <GpxInput />
        </p>
      </div>
    </div>
  );
}
