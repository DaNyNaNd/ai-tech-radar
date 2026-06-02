export function parseRating(value: string | undefined): 1 | 2 | 3 | 4 | 5 | null | undefined {
  if (value == null) return undefined;
  if (value === 'null') return null;

  if (['1', '2', '3', '4', '5'].includes(value)) {
    return Number(value) as 1 | 2 | 3 | 4 | 5;
  }

  throw new Error(`Invalid rating: ${value}`);
}
