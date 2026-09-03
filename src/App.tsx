import { MapContainer, TileLayer } from "react-leaflet";
import GpxLayer from "./components/ui/GpxLayer";
import GpxInput from "./components/ui/GpxInput";
import DepartureTime from "./components/ui/DepartureTime";
import SpeedInput from "./components/ui/SpeedInput";
import { RouteProvider } from "./contexts/RouteContext";
import ShowWeather from "./components/ui/ShowWeather";
import RiderProfile from "./components/ui/RiderProfile";
import MapWeatherWaypoints from "./components/ui/MapWeatherWaypoints";
import { useRoute } from "./hooks/useRoute";
import { Toaster } from "react-hot-toast";

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
    <div className="flex flex-col lg:flex-row lg:h-screen w-screen bg-zinc-900">
      <Toaster position="bottom-center" />

      <div className="w-full h-[50vh] lg:h-auto lg:flex-1">
        <MapContainer
          // Center of Germany as default zoom
          center={[51.1657, 10.4515]}
          zoom={5}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
            maxZoom={16}
          />
          {gpxUrl && <GpxLayer />}
          <MapWeatherWaypoints />
        </MapContainer>
      </div>

      <div className="w-full lg:w-96 xl:w-md bg-zinc-800 border-t lg:border-t-0 lg:border-l border-zinc-700 p-4 text-white lg:overflow-y-auto lg:h-screen overflow-x-hidden">
        <GpxInput />
        <DepartureTime />
        <RiderProfile />
        <SpeedInput />
        <ShowWeather />
        <a
          href={`${import.meta.env.BASE_URL}privacy.html`}
          style={{
            display: "block",
            textAlign: "center",
            textDecoration: "underline",
            fontSize: "0.75rem",
            marginTop: "1rem",
          }}
        >
          Privacy
        </a>
      </div>
    </div>
  );
}
