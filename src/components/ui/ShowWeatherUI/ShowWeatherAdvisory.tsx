function ShowWeatherAdvisory({ message }: { message: string | string[] }) {
  const messages = Array.isArray(message) ? message : [message];

  return (
    <div className="flex flex-wrap gap-1.5 mb-4 px-1">
      {messages.map((msg, i) => (
        <span
          key={i}
          className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300"
        >
          {msg}
        </span>
      ))}
    </div>
  );
}

export default ShowWeatherAdvisory;
