import { useRoute } from "../../hooks/useRoute";

function SpeedInput() {
  const { setSpeed, speed } = useRoute();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">
          Average Speed
        </label>
        <span className="text-sm font-bold text-white">{speed} km/h</span>
      </div>
      <input
        type="range"
        min={5}
        max={30}
        step={1}
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
        className="w-full accent-green-400"
      />
      <div className="flex justify-between text-xs text-zinc-500">
        <span>5 km/h</span>
        <span>30 km/h</span>
      </div>
    </div>
  );
}

export default SpeedInput;
