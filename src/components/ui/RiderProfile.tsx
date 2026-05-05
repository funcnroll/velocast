import { useRoute } from "../../hooks/useRoute";
import type { RiderProfileType } from "../../types/RiderProfileType";
import CategoryDiv from "./general/CategoryDiv";
import CategoryTitle from "./general/CategoryTitle";

const profiles: {
  value: RiderProfileType;
  label: string;
  description: string;
}[] = [
  {
    value: "casual",
    label: "Casual",
    description: "Comfortable conditions only",
  },
  { value: "regular", label: "Regular", description: "Handles most weather" },
  {
    value: "hardcore",
    label: "Hardcore",
    description: "Rides in almost anything",
  },
];

function RiderProfile() {
  const { setRiderProfile, riderProfile } = useRoute();

  return (
    <CategoryDiv>
      <CategoryTitle>Rider Profile</CategoryTitle>

      <div className="flex gap-2">
        {profiles.map(({ value, label, description }) => {
          const active = riderProfile === value;
          return (
            <button
              key={value}
              onClick={() => setRiderProfile(value)}
              className={`flex-1 py-2 px-2 hover:cursor-pointer rounded-lg border text-left transition-all ${
                active
                  ? "border-zinc-400 bg-zinc-700 text-zinc-100"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
              }`}
            >
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-xs mt-0.5 opacity-70">{description}</p>
            </button>
          );
        })}
      </div>
    </CategoryDiv>
  );
}

export default RiderProfile;
