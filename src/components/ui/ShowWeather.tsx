import { useWeatherFetch } from "../../hooks/useWeatherFetch";
import { useRoute } from "../../hooks/useRoute";
import { green, red, yellow } from "../../config/colors";
import { degreesToCompass } from "../../helpers/degreesToCompass";
import { uvLabel } from "../../helpers/uvLabel";
import StatRow from "./StatRow";
import ShowWeatherIsLoading from "./ShowWeatherUI/ShowWeatherStates/ShowWeatherIsLoading";
import ShowWeatherError from "./ShowWeatherUI/ShowWeatherStates/ShowWeatherError";
import ShowWeatherSegmentInspect from "./ShowWeatherUI/ShowWeatherStates/ShowWeatherSegmentInspect";
import ShowWeatherScoreVerdict from "./ShowWeatherUI/ShowWeatherScoreVerdict";
import ShowWeatherETA from "./ShowWeatherUI/ShowWeatherEta";
import ShowWeatherAdvisory from "./ShowWeatherUI/ShowWeatherAdvisory";
import { useMobileToasts } from "../../hooks/useMobileToasts";

function ShowWeather() {
  useWeatherFetch();

  const { sidebarData, error, gpxLines, isLoading, hasLoaded } = useRoute();

  useMobileToasts(sidebarData, isLoading, hasLoaded, error);

  if (!gpxLines && !error) return null;

  if (isLoading) return <ShowWeatherIsLoading />;

  if (error) return <ShowWeatherError error={error} />;

  if (!sidebarData) return <ShowWeatherSegmentInspect />;

  const verdictColor =
    sidebarData.verdict === "green"
      ? green
      : sidebarData.verdict === "yellow"
        ? yellow
        : red;

  const breakdown = sidebarData.breakdown;

  const conditions = [
    { label: "Feels like", value: breakdown?.apparent_temp, unit: "°C" },
    { label: "Rain", value: breakdown?.rain, unit: "mm" },
    {
      label: "Precipation chance",
      value: breakdown?.precipitation_probability,
      unit: "%",
    },
    { label: "Wind", value: breakdown?.wind_speed_10m, unit: "km/h" },
    { label: "Gusts", value: breakdown?.wind_gusts_10m, unit: "km/h" },
    {
      label: "Direction",
      value: breakdown?.wind_direction_10m,
      format: (v: number) => `${degreesToCompass(v)} (${v}°)`,
    },
    {
      label: "UV",
      value: breakdown?.uv_index,
      format: (v: number) => `${uvLabel(v)} (${v})`,
    },
  ];

  return (
    <div className="mt-4 space-y-3">
      <ShowWeatherScoreVerdict
        score={sidebarData.score}
        verdict={sidebarData.verdict}
        verdictColor={verdictColor}
      />

      {sidebarData.eta && <ShowWeatherETA eta={sidebarData.eta} />}

      <ShowWeatherAdvisory message={sidebarData.message} />

      {/* breakdown */}
      <div className="rounded-lg bg-zinc-900/60 p-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wide  mb-2">
          Conditions
        </p>
        {conditions.map(
          ({ label, value, unit, format }) =>
            value !== undefined && (
              <StatRow
                key={label}
                label={label}
                value={format ? format(value) : `${value} ${unit}`}
              />
            ),
        )}
      </div>
    </div>
  );
}

export default ShowWeather;
