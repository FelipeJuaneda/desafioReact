import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { RiCalendarEventLine, RiGoogleLine, RiNotification3Line } from "@remixicon/react";
import { toast } from "sonner";
import { buttonClasses, type ButtonSize } from "@/components/ui/buttonClasses";
import { formatShortDate } from "@/lib/dates";
import { slugify } from "@/lib/slug";
import { downloadIcs, googleCalendarUrl, type ReleaseEvent } from "./calendar";

const itemClasses =
  "flex min-h-11 w-full items-center gap-3 rounded-perf px-3 text-left text-body text-emulsion " +
  "data-focus:bg-acetate-raised [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-emulsion-muted";

interface ReminderButtonProps {
  event: ReleaseEvent;
  size?: ButtonSize;
  className?: string;
}

/** "Avisame": puts the opening day in the viewer's calendar (Google, or an .ics for the rest). */
export const ReminderButton = ({ event, size = "md", className }: ReminderButtonProps) => {
  const day = formatShortDate(event.date);

  return (
    <Menu>
      <MenuButton
        aria-label={`Avisame cuando se estrene ${event.title}`}
        className={buttonClasses({
          variant: "secondary",
          size,
          className: `data-open:border-edge ${className ?? ""}`,
        })}
      >
        <RiNotification3Line aria-hidden />
        Avisame
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        transition
        className="z-(--z-popover) mt-2 w-72 rounded-sheet border border-frameline bg-acetate p-1.5 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] transition duration-(--duration-fast) ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <p className="px-3 pt-2 pb-2.5 text-small text-emulsion-muted">
          Sumá el estreno del <strong className="font-semibold text-emulsion">{day}</strong> a tu
          calendario, con aviso ese día a las 10.
        </p>
        <MenuItem>
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClasses}
          >
            <RiGoogleLine aria-hidden />
            Google Calendar
          </a>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            className={itemClasses}
            onClick={() => {
              downloadIcs(event, `estreno-${slugify(event.title) || event.id}.ics`);
              toast(`Abrí el archivo para agendar "${event.title}"`, {
                description: "Sirve para Apple, Outlook y cualquier calendario.",
              });
            }}
          >
            <RiCalendarEventLine aria-hidden />
            Apple, Outlook y otros (.ics)
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
