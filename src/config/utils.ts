export function parseBoolean(
  value: string | undefined,
  fallback = false,
): boolean {
  if (value === undefined) {
    return fallback;
  }

  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

export function parseNumber(value: string | undefined, fallback = 0): number {
  const parsed = Number(value);

  return isNaN(parsed) ? fallback : parsed;
}

export function parseString(value: string | undefined, fallback = ''): string {
  return value ?? fallback;
}
