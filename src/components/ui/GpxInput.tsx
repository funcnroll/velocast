import { useGpxInput } from "../../hooks/useGpxInput";
import { useRoute } from "../../hooks/useRoute";

// TODO: refactor this component
export function GpxInput() {
  const { gpxLines } = useRoute();

  const {
    isLoopRoute,
    templateRouteLoaded,
    handleLoadTemplate,
    handleFileChange,
  } = useGpxInput();

  return (
    <div>
      <label
        className={`flex flex-col items-center justify-center gap-2 w-full py-6 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
          gpxLines
            ? "border-zinc-600 bg-zinc-800/30"
            : "border-zinc-600 bg-zinc-800/50 hover:border-zinc-400 hover:bg-zinc-800"
        }`}
      >
        {/* https://heroicons.com/outline  arrow-up-tray */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-zinc-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>

        <p className="text-sm text-zinc-400">
          {gpxLines ? "Route loaded - click to replace" : "Upload GPX file"}
        </p>
        <input
          type="file"
          accept=".gpx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {!templateRouteLoaded && (
        <button
          type="button"
          onClick={handleLoadTemplate}
          className="w-full py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors text-sm text-zinc-200 cursor-pointer mt-4"
        >
          Load template route
        </button>
      )}

      {isLoopRoute && (
        <p className="text-xs text-zinc-500 mt-3">
          Loop route detected. The final segment back to the start is not
          visualised.
        </p>
      )}
    </div>
  );
}

export default GpxInput;
