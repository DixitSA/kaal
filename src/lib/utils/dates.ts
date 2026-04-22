const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function parseIsoDateToUtc(date: string): number {
  if (!ISO_DATE_PATTERN.test(date)) {
    throw new Error(`Invalid ISO date: ${date}`);
  }

  const parsed = Date.parse(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed)) {
    throw new Error(`Unable to parse ISO date: ${date}`);
  }

  return parsed;
}

export function isIsoDate(date: string): boolean {
  return ISO_DATE_PATTERN.test(date);
}

export function daysBetweenIsoDates(startDate: string, endDate: string): number {
  const startUtc = parseIsoDateToUtc(startDate);
  const endUtc = parseIsoDateToUtc(endDate);
  return Math.round((endUtc - startUtc) / MILLISECONDS_PER_DAY);
}

export function toUtcMidnightIso(date: string): string {
  const timestamp = parseIsoDateToUtc(date);
  return new Date(timestamp).toISOString();
}
