import { createContext, useContext, useState, useMemo } from "react";
import type { RiderProfileType } from "../types/RiderProfileType";
import type { ScoreResult } from "../types/ScoreResult";
import { useDebounce } from "@uidotdev/usehooks";
import { intervalKm } from "../config/intervalKm";
import type { LatLon } from "../types/LatLon";
import type { EtaPoint } from "../types/EtaPoint";

type RouteContextType = {
  // TODO: type this properly
  weatherFetchPoints: any[];
  setWeatherFetchPoints: (points: any[]) => void;
  distance: number;
  setDistance: (distance: number) => void;
  etaArr: EtaPoint[];
  departureTime: Date;
  setDepartureTime: (date: Date) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  riderProfile: RiderProfileType;
  setRiderProfile: (profile: RiderProfileType) => void;
  data: ScoreResult[];
  setData: (data: ScoreResult[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  gpxUrl: string;
  setGpxUrl: (gpxUrl: string) => void;
  debouncedSpeed: number;
  gpxLines: any;
  setGpxLines: (gpxLine: any) => void;
  sidebarData: ScoreResult | null;
  setSidebarData: (sidebarData: ScoreResult) => void;
  error: string;
  setError: (error: String) => void;
};

const RouteContext = createContext<RouteContextType | null>(null);

// TODO: refactor routecontext, way too many unrelated pieces, too unorganised
export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [weatherFetchPoints, setWeatherFetchPoints] = useState<any[]>([]);
  const [distance, setDistance] = useState(0);
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [speed, setSpeed] = useState<number>(20);
  const [riderProfile, setRiderProfile] = useState<string>("casual");
  const [data, setData] = useState<ScoreResult[]>([]);
  const debouncedSpeed = useDebounce(speed, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [gpxUrl, setGpxUrl] = useState<string | null>(null);
  const [gpxLines, setGpxLines] = useState<any>(null);
  const [sidebarData, setSidebarData] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string>("");

  const etaArr = useMemo(() => {
    if (!weatherFetchPoints.length || !debouncedSpeed) return [];

    return weatherFetchPoints.map((point, i) => {
      // divide each waypoint into segments, of which the approximate eta is calculated
      const coords = point.geometry.coordinates as LatLon;
      const distanceKm = i * intervalKm;
      const hoursToArrive = distanceKm / debouncedSpeed;
      const etaMs = departureTime.getTime() + hoursToArrive * 60 * 60 * 1000;
      return { coord: coords, eta: new Date(etaMs) };
    });
  }, [departureTime, debouncedSpeed, weatherFetchPoints]);

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
        setSidebarData,
        setError,
        error,
      }}
    >
      {children}
    </RouteContext>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) throw new Error("useRoute must be used within a RouteProvider");
  return context;
}
