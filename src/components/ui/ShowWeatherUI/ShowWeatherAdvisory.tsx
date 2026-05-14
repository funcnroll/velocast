import { advisorySeverityStyles } from "../../../config/advisorySeverityStyles";
import type { AdvisoryMessage } from "../../../types/AdvisoryMessage";

function ShowWeatherAdvisory({
  message,
  verdict,
}: {
  message: string | AdvisoryMessage[];
  verdict: "green" | "yellow" | "red";
}) {
  const messages = Array.isArray(message)
    ? message
    : [{ text: message, severity: verdict }];

  return (
    <div className="flex flex-wrap gap-1.5 mb-4 px-1">
      {messages.map((msg, i) => (
        <span
          key={i}
          style={{ color: advisorySeverityStyles[msg.severity].color }}
          className={`text-xs px-2.5 py-1 rounded-full bg-zinc-800 border ${advisorySeverityStyles[msg.severity]}`}
        >
          {msg.text}
        </span>
      ))}
    </div>
  );
}

export default ShowWeatherAdvisory;
