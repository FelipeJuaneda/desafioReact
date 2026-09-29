import {
  RiBookmarkLine,
  RiFilmLine,
  RiMovie2Line,
  RiSearchLine,
  RiTv2Line,
  type RemixiconComponentType,
} from "@remixicon/react";
import { NavLink } from "react-router";
import { paths } from "@/app/paths";

const TABS: Array<{ to: string; label: string; icon: RemixiconComponentType; end?: boolean }> = [
  { to: paths.home, label: "Inicio", icon: RiFilmLine, end: true },
  { to: paths.movies, label: "Películas", icon: RiMovie2Line },
  { to: paths.series, label: "Series", icon: RiTv2Line },
  { to: paths.search(), label: "Buscar", icon: RiSearchLine },
  { to: paths.myList, label: "Mi lista", icon: RiBookmarkLine },
];

/** Thumb-reachable navigation for phones; search is a destination of its own. */
export const TabBar = () => (
  <nav
    aria-label="Principal"
    className="fixed inset-x-0 bottom-0 z-(--z-tabbar) border-t border-frameline bg-acetate pb-[env(safe-area-inset-bottom)] md:hidden"
  >
    <ul className="grid grid-cols-5">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            className="relative grid min-h-14 justify-items-center gap-0.5 pt-2 pb-1.5 text-[0.75rem] font-semibold text-emulsion-muted before:absolute before:inset-x-[30%] before:top-0 before:h-0.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-edge aria-[current=page]:text-emulsion aria-[current=page]:before:bg-edge"
          >
            <Icon aria-hidden className="size-[1.375rem]" />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);
