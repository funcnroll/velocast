function SpeedInput({ setSpeed, speed }) {
  return (
    <div>
      <input
        type="range"
        min={5}
        max={30}
        step={1}
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      <span>{speed} km/h</span>
    </div>
  );
}

export default SpeedInput;
