import { MapContainer, TileLayer } from "react-leaflet";
import GpxLayer from "./components/ui/GpxLayer";
import GpxInput from "./components/ui/GpxInput";
import DepartureTime from "./components/ui/DepartureTime";
import SpeedInput from "./components/ui/SpeedInput";
import { RouteProvider } from "./contexts/RouteContext";

export default function App() {
  return (
    <RouteProvider>
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

        <div className="w-80 bg-zinc-800 border-l border-zinc-700 p-4 text-white">
          <GpxInput />
          <DepartureTime />
          <SpeedInput />
        </div>
      </div>
    </RouteProvider>
  );
}
