import { useRoute } from "../../hooks/useRoute";

function DepartureTime() {
  const { setDepartureTime } = useRoute();

  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const toDateTimeLocal = (date: Date) => date.toISOString().slice(0, 16);

  return (
    <input
      type="datetime-local"
      min={toDateTimeLocal(now)}
      max={toDateTimeLocal(sevenDaysFromNow)}
      defaultValue={toDateTimeLocal(now)}
      onChange={(e) => setDepartureTime(new Date(e.target.value))}
    />
  );
}

export default DepartureTime;
