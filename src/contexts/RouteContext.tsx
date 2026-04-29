import { createContext, useContext, useState } from "react";

type RouteContextType = {
  // TODO: type this properly
  weatherFetchPoints: any[];
  setWeatherFetchPoints: (points: any[]) => void;
  distance: number;
  setDistance: (distance: number) => void;
};

const RouteContext = createContext<RouteContextType | null>(null);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [weatherFetchPoints, setWeatherFetchPoints] = useState([]);
  const [distance, setDistance] = useState(0);

  return (
    <RouteContext
      value={{
        weatherFetchPoints,
        setWeatherFetchPoints,
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
