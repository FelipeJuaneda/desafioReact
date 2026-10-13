// "Avisame": a release as an all-day calendar event. No account and no push server: the
// viewer's own calendar does the reminding.

export interface ReleaseEvent {
  /** TMDB id, for a stable event UID (re-adding updates instead of duplicating). */
  id: number;
  title: string;
  /** Release day, "YYYY-MM-DD". */
  date: string;
  /** Link back to the title page. */
  url: string;
}

const compact = (date: string) => date.replaceAll("-", "");

const nextDay = (date: string) => {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
};

const summary = (event: ReleaseEvent) => `Estreno: ${event.title}`;
const details = (event: ReleaseEvent) =>
  `Hoy se estrena ${event.title} en cines de Argentina.\n${event.url}`;

export const googleCalendarUrl = (event: ReleaseEvent) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: summary(event),
    dates: `${compact(event.date)}/${compact(nextDay(event.date))}`,
    details: details(event),
    location: "Cines de Argentina",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

/** RFC 5545 text: escape \ ; , and newlines. */
const icsText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** RFC 5545 lines are at most 75 octets; longer ones continue after CRLF + space. */
const fold = (line: string) => {
  const chunks: string[] = [];
  let rest = line;
  while (new TextEncoder().encode(rest).length > 75) {
    let cut = 74;
    while (new TextEncoder().encode(rest.slice(0, cut)).length > 74) cut -= 1;
    chunks.push(rest.slice(0, cut));
    rest = ` ${rest.slice(cut)}`;
  }
  return [...chunks, rest].join("\r\n");
};

export const icsContent = (event: ReleaseEvent, now = new Date()) => {
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PelicuLed//Estrenos//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:estreno-${event.id}@peliculed`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(event.date)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(event.date))}`,
    `SUMMARY:${icsText(summary(event))}`,
    `DESCRIPTION:${icsText(details(event))}`,
    `URL:${event.url}`,
    "TRANSP:TRANSPARENT",
    // 10 a.m. on release day.
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsText(`Hoy se estrena ${event.title}`)}`,
    "TRIGGER;RELATED=START:PT10H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
};

/** Saves the .ics: phones hand it to the calendar app, desktops to the default client. */
export const downloadIcs = (event: ReleaseEvent, fileName: string) => {
  const blob = new Blob([icsContent(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href: url, download: fileName });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
