import { MINUTES_PER_DAY, UNIX_EPOCH_JULIAN_DAY } from "@/lib/astro/constants";

const DEFAULT_UNKNOWN_TIME = "12:00";
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

interface TimeParts {
  hour: number;
  minute: number;
}

function parseIsoDate(date: string): DateParts {
  if (!ISO_DATE_PATTERN.test(date)) {
    throw new Error(`Invalid ISO date: ${date}`);
  }

  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function parseTime(time?: string): TimeParts {
  const normalized = time ?? DEFAULT_UNKNOWN_TIME;
  if (!ISO_TIME_PATTERN.test(normalized)) {
    throw new Error(`Invalid 24-hour time: ${normalized}`);
  }

  const [hour, minute] = normalized.split(":").map(Number);
  return { hour, minute };
}

function getTimeZoneParts(date: Date, timezone: string): DateParts & TimeParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const partValue = (type: Intl.DateTimeFormatPartTypes): number => {
    const part = parts.find((candidate) => candidate.type === type);
    if (!part) {
      throw new Error(`Missing ${type} while resolving timezone ${timezone}`);
    }

    return Number(part.value);
  };

  return {
    year: partValue("year"),
    month: partValue("month"),
    day: partValue("day"),
    hour: partValue("hour"),
    minute: partValue("minute")
  };
}

export function getIsoDateInTimeZone(date: Date, timezone: string): string {
  const parts = getTimeZoneParts(date, timezone);
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");

  return `${parts.year}-${month}-${day}`;
}

export function resolveBirthUtcDate(
  date: string,
  time?: string,
  timezone: string = "UTC"
): Date {
  const { year, month, day } = parseIsoDate(date);
  const { hour, minute } = parseTime(time);
  const targetLocalTimestamp = Date.UTC(year, month - 1, day, hour, minute, 0, 0);

  let guessUtcTimestamp = targetLocalTimestamp;

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const zoned = getTimeZoneParts(new Date(guessUtcTimestamp), timezone);
    const representedLocalTimestamp = Date.UTC(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      zoned.hour,
      zoned.minute,
      0,
      0
    );
    const correction = targetLocalTimestamp - representedLocalTimestamp;

    guessUtcTimestamp += correction;

    if (correction === 0) {
      break;
    }
  }

  return new Date(guessUtcTimestamp);
}

export function calculateJulianDay(
  date: string,
  time?: string,
  timezone: string = "UTC"
): number {
  const utcDate = resolveBirthUtcDate(date, time, timezone);
  return UNIX_EPOCH_JULIAN_DAY + utcDate.getTime() / (MINUTES_PER_DAY * 60 * 1000);
}
