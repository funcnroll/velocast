import { createContext, useContext, useState, useMemo } from "react";
import type { Waypoint } from "../types/Waypoint";
import type { RiderProfileType } from "../types/RiderProfileType";
import type { ScoreResult } from "../types/ScoreResult";
import { useDebounce } from "@uidotdev/usehooks";

type RouteContextType = {
  // TODO: type this properly
  weatherFetchPoints: any[];
  setWeatherFetchPoints: (points: any[]) => void;
  distance: number;
  setDistance: (distance: number) => void;
  etaArr: Waypoint[];
  departureTime: Date;
  setDepartureTime: (date: Date) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  riderProfile: RiderProfileType;
  setRiderProfile: (profile: RiderProfileType) => void;
  data: ScoreResult[];
  setData: (data: ScoreResult[]) => void;
};

const RouteContext = createContext<RouteContextType | null>(null);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [weatherFetchPoints, setWeatherFetchPoints] = useState<any[]>([]);
  const [distance, setDistance] = useState(0);
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [speed, setSpeed] = useState<number>(0);
  const [riderProfile, setRiderProfile] = useState<string>("casual");
  const [data, setData] = useState<ScoreResult[]>([]);
  const debouncedSpeed = useDebounce(speed, 300);

  const etaArr = useMemo(() => {
    if (!weatherFetchPoints.length || !debouncedSpeed) return [];

    return weatherFetchPoints.map((point, i) => {
      const coords = point.geometry.coordinates as [number, number];

      // Keeep distances bigger to not flood OpenMeteo with too many requests
      const distanceKm = i * 15; // 15km intervals
      const hoursToArrive = distanceKm / debouncedSpeed;

      // calculate eta by adding hoursToArrive to departureTime
      const etaMs = departureTime.getTime() + hoursToArrive * 60 * 60 * 1000;

      return { coord: [...coords], eta: new Date(etaMs) };
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
        setSpeed,
        riderProfile,
        setRiderProfile,
        setData,
        data,
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
