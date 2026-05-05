export function uvLabel(uv: number): string {
  if (uv >= 8) return "Very High";
  if (uv >= 6) return "High";
  if (uv >= 3) return "Moderate";
  return "Low";
}
