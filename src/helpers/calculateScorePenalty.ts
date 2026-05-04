export function calculateScorePenalty(
  value: number,
  max: number,
  exponent: number,
  maxPenalty: number,
  multiplier: number,
): number {
  // Scoring uses a continuous exponential penalty formula: Math.pow(value / max, exponent) * maxPenalty * multiplier
  // value/max normalises the input to 0-1 (0 = perfect, 1 = worst case)
  // value serves as the actual data value, max is the threshold where the maximum penalty is reached (as in, considered the worst case)
  // Math.pow(..., exponent) curves the penalty — exponent > 1 means low values barely register but high values are punished disproportionately (no hard jumps)
  // maxPenalty scales the result to the maximum points that factor can deduct
  // profile multipliers then adjust the final penalty per rider type
  return Math.pow(value / max, exponent) * maxPenalty * multiplier;
}
