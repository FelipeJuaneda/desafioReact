// Calendar dates ("2026-10-16") as the viewer's local day: TMDB release and air dates have no
// time, and reading them as UTC would move them a day back in Argentina.

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Today in the viewer's time zone, as "YYYY-MM-DD". */
export const todayIso = (now = new Date()) =>
  [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");

/** "2026-10-16" -> that day at UTC midnight (a stable key for day arithmetic), or null. */
const toUtcDay = (date: string | null | undefined) => {
  const match = ISO_DATE.exec(date ?? "");
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

export const isIsoDate = (date: string | null | undefined): date is string =>
  toUtcDay(date) !== null;

/** Whole days from today to the date: 0 today, 1 tomorrow, negative in the past. */
export const daysUntil = (date: string, today = todayIso()) => {
  const target = toUtcDay(date);
  const base = toUtcDay(today);
  return target === null || base === null ? null : Math.round((target - base) / DAY_MS);
};

const parts = (date: string, options: Intl.DateTimeFormatOptions) => {
  const day = toUtcDay(date);
  return day === null
    ? null
    : new Intl.DateTimeFormat("es-AR", { ...options, timeZone: "UTC" })
        .format(new Date(day))
        .replace(".", "");
};

/** "2026-10-16" -> { weekday: "jue", day: "16", month: "oct", year: "2026" }. */
export const dateStamp = (date: string) => ({
  weekday: parts(date, { weekday: "short" }) ?? "",
  day: parts(date, { day: "numeric" }) ?? "",
  month: parts(date, { month: "short" }) ?? "",
  year: date.slice(0, 4),
});

/** "2026-10-16" -> "16 oct" (or "16 oct 2027" when it isn't this year). */
export const formatShortDate = (date: string | null | undefined, today = todayIso()) => {
  if (!isIsoDate(date)) return null;
  const { day, month, year } = dateStamp(date);
  return year === today.slice(0, 4) ? `${day} ${month}` : `${day} ${month} ${year}`;
};

/** 0 -> "Hoy", 1 -> "Mañana", 5 -> "En 5 días", 21 -> "En 3 semanas". */
export const formatCountdown = (days: number) => {
  if (days <= 0) return "Hoy";
  if (days === 1) return "Mañana";
  if (days < 14) return `En ${days} días`;
  return `En ${Math.round(days / 7)} semanas`;
};
