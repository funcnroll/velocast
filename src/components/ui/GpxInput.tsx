export function GpxInput() {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const text = file.text();

    console.log(text);
  }

  return (
    <input
      type="file"
      accept=".gpx"
      onChange={handleFileChange}
    />
  );
}

export default GpxInput;
