import type { RiderProfileType } from "../types/RiderProfileType";

export const profileConfig: Record<
  RiderProfileType,
  { windMultiplier: number; tempMultiplier: number; rainMultiplier: number }
> = {
  casual: {
    windMultiplier: 1.3,
    tempMultiplier: 1.1,
    rainMultiplier: 1.4,
  },
  regular: {
    windMultiplier: 1,
    tempMultiplier: 1,
    rainMultiplier: 1,
  },
  hardcore: {
    windMultiplier: 0.85,
    tempMultiplier: 0.9,
    rainMultiplier: 0.95,
  },
};
