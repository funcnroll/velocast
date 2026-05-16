import { useRoute } from "../../hooks/useRoute";
import CategoryDiv from "./general/CategoryDiv";
import CategoryTitle from "./general/CategoryTitle";

const now = new Date();
const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const toDateTimeLocal = (date: Date) => date.toISOString().slice(0, 16);

function DepartureTime() {
  const { setDepartureTime, departureTime } = useRoute();

  return (
    <CategoryDiv>
      <CategoryTitle>Departure Time</CategoryTitle>
      <input
        type="datetime-local"
        min={toDateTimeLocal(now)}
        max={toDateTimeLocal(sevenDaysFromNow)}
        value={toDateTimeLocal(departureTime)}
        onChange={(e) => setDepartureTime(new Date(e.target.value))}
        className="w-full max-w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-400 transition-colors"
      />
    </CategoryDiv>
  );
}

export default DepartureTime;
