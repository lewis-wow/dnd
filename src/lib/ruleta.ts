import { fisherYatesShuffle, hashSeed, mulberry32 } from "@/lib/prng";

export const RULETA_NUMBER_COUNT = 36;
export const RULETA_NUMBERS: readonly number[] = Array.from({ length: RULETA_NUMBER_COUNT }, (_, i) => i + 1);

export interface RuletaAssignment {
  name: string;
  numbers: number[];
}

/** Shuffles the 36 roulette numbers deterministically off `seed`, gives every
 * person the same floor(36 / x) share, then hands the 36 mod x leftover
 * numbers out one-per-person to a random subset of the roster — chosen from
 * that same seeded stream, so which people get the extra number is random
 * but still reproducible for a given seed + roster. */
export function distributeRuleta(seed: string, names: readonly string[]): RuletaAssignment[] {
  const personCount = names.length;
  if (personCount === 0) return [];

  const rng = mulberry32(hashSeed(seed));
  const shuffledNumbers = fisherYatesShuffle(RULETA_NUMBERS, rng);

  const base = Math.floor(RULETA_NUMBER_COUNT / personCount);
  const remainder = RULETA_NUMBER_COUNT % personCount;

  const groups: number[][] = names.map((_, i) => shuffledNumbers.slice(i * base, i * base + base));

  const remainderPool = shuffledNumbers.slice(personCount * base);
  const luckyOrder = fisherYatesShuffle(
    names.map((_, i) => i),
    rng
  );
  luckyOrder.slice(0, remainder).forEach((personIdx, k) => {
    groups[personIdx].push(remainderPool[k]);
  });

  return names.map((name, i) => ({ name, numbers: groups[i] }));
}
