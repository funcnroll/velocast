import { MapContainer, TileLayer } from "react-leaflet";
import GpxLayer from "./components/ui/GpxLayer";
import GpxInput from "./components/ui/GpxInput";
import DepartureTime from "./components/ui/DepartureTime";
import SpeedInput from "./components/ui/SpeedInput";
import { RouteProvider, useRoute } from "./contexts/RouteContext";
import ShowWeather from "./components/ui/ShowWeather";
import RiderProfile from "./components/ui/RiderProfile";
import MapWeatherWaypoints from "./components/ui/MapWeatherWaypoints";

export default function App() {
  return (
    <RouteProvider>
      <AppInner />
    </RouteProvider>
  );
}

function AppInner() {
  const { gpxUrl } = useRoute();

  return (
    <div className="flex h-screen w-screen bg-zinc-900">
      <div className="flex-1">
        <MapContainer
          // Center of Germany as default zoom
          center={[51.1657, 10.4515]}
          zoom={5}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            maxZoom={19}
          />
          {gpxUrl && <GpxLayer />}
          <MapWeatherWaypoints />
        </MapContainer>
      </div>

      <div className="w-80 bg-zinc-800 border-l border-zinc-700 p-4 text-white">
        <GpxInput />
        <DepartureTime />
        <RiderProfile />
        <SpeedInput />
        <ShowWeather />
      </div>
    </div>
  );
}
