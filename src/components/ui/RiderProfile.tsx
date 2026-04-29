import { useRoute } from "../../contexts/RouteContext";
import type { RiderProfileType } from "../../types/RiderProfileType";

function RiderProfile() {
  const { setRiderProfile, riderProfile } = useRoute();

  return (
    <div>
      <label>Rider profile: </label>

      <select
        value={riderProfile}
        onChange={(e) => setRiderProfile(e.target.value as RiderProfileType)}
      >
        <option value="casual">Casual</option>
        <option value="regular">Regular</option>
        <option value="hardcore">Hardcore</option>
      </select>
    </div>
  );
}

export default RiderProfile;
