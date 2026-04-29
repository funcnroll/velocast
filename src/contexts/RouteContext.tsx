import { createContext, useContext, useState } from "react";
import type { Waypoint } from "../types/Waypoint";

type RouteContextType = {
  // TODO: type this properly
  weatherFetchPoints: any[];
  setWeatherFetchPoints: (points: any[]) => void;
  distance: number;
  setDistance: (distance: number) => void;
  etaArr: Date[];
  setEtaArr: (etaArr: Waypoint[]) => void;
};

const RouteContext = createContext<RouteContextType | null>(null);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [weatherFetchPoints, setWeatherFetchPoints] = useState([]);
  const [distance, setDistance] = useState(0);
  const [etaArr, setEtaArr] = useState([] as Date[]);

  // TODO: properly centralise logic as needed - not as prop drilling AND using a route
  return (
    <RouteContext
      value={{
        weatherFetchPoints,
        setWeatherFetchPoints,
        etaArr,
        setEtaArr,
        distance,
        setDistance,
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
