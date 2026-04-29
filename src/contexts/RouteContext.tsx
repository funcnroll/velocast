import { createContext, useContext, useState, useMemo } from "react";
import type { Waypoint } from "../types/Waypoint";
import type { RiderProfileType } from "../types/RiderProfileType";

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
};

const RouteContext = createContext<RouteContextType | null>(null);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [weatherFetchPoints, setWeatherFetchPoints] = useState<any[]>([]);
  const [distance, setDistance] = useState(0);
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [speed, setSpeed] = useState<number>(0);
  const [riderProfile, setRiderProfile] = useState<string>("casual");

  const etaArr = useMemo(() => {
    if (!weatherFetchPoints.length || !speed) return [];

    return weatherFetchPoints.map((point, i) => {
      const coords = point.geometry.coordinates as [number, number];
      const distanceKm = i * 5;
      const hoursToArrive = distanceKm / speed;

      // calculate eta by adding hoursToArrive to departureTime
      const etaMs = departureTime.getTime() + hoursToArrive * 60 * 60 * 1000;

      return { coord: [...coords], eta: new Date(etaMs) };
    });
  }, [departureTime, speed, weatherFetchPoints]);

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
        speed,
        setSpeed,
        riderProfile,
        setRiderProfile,
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
