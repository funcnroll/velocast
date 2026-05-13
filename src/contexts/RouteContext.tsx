import { useState, useMemo, createContext } from "react";
import type { RiderProfileType } from "../types/RiderProfileType";
import type { ScoreResult } from "../types/ScoreResult";
import { useDebounce } from "@uidotdev/usehooks";
import { intervalKm } from "../config/intervalKm";
import type { LatLon } from "../types/LatLon";
import type { Feature, Point } from "geojson";
import type { RouteContextType } from "../types/RouteContextType";

export const RouteContext = createContext<RouteContextType | null>(null);

// Avoid creation on each re-render by setting this on the outside , thus not sending too many requests to Open-Meteo
const initialDepartureTime = new Date();

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [weatherFetchPoints, setWeatherFetchPoints] = useState<
    Feature<Point>[]
  >([]);
  const [distance, setDistance] = useState(0);
  const [departureTime, setDepartureTime] =
    useState<Date>(initialDepartureTime);
  const [speed, setSpeed] = useState<number>(20);
  const [riderProfile, setRiderProfile] = useState<RiderProfileType>("casual");
  const [data, setData] = useState<ScoreResult[]>([]);
  const debouncedSpeed = useDebounce(speed, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [gpxUrl, setGpxUrl] = useState<string>("");
  const [gpxLines, setGpxLines] = useState<LatLon[] | null>(null);
  const [error, setError] = useState<string>("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);

  const etaArr = useMemo(() => {
    if (!weatherFetchPoints.length || !debouncedSpeed) return [];

    return weatherFetchPoints.map((point, i) => {
      const coords = point.geometry.coordinates as LatLon;
      const distanceKm = i * intervalKm;
      const hoursToArrive = distanceKm / debouncedSpeed;
      const etaMs = departureTime.getTime() + hoursToArrive * 60 * 60 * 1000;
      return { coord: coords, eta: new Date(etaMs) };
    });
  }, [departureTime, debouncedSpeed, weatherFetchPoints]);

  // data is cleared on file change so this is null during any fetch and setSelectedSegmentIndex is set to 0, so there is no risk of undefined here
  const sidebarData = data.length > 0 ? data[selectedSegmentIndex] : null;

  return (
    <RouteContext
      value={{
        weatherFetchPoints,
        setWeatherFetchPoints,
        distance,
        setDistance,
        etaArr,
        departureTime,
        setDepartureTime,
        debouncedSpeed,
        speed,
        setSpeed,
        riderProfile,
        setRiderProfile,
        setData,
        data,
        isLoading,
        setIsLoading,
        gpxUrl,
        setGpxUrl,
        gpxLines,
        setGpxLines,
        sidebarData,

        setError,
        error,
        hasLoaded,
        setHasLoaded,
        selectedSegmentIndex,
        setSelectedSegmentIndex,
      }}
    >
      {children}
    </RouteContext>
  );
}
