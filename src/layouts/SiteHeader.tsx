import { RiSearchLine } from "@remixicon/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router";
import { paths } from "@/app/paths";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { cn } from "@/lib/cn";

// Guests never see the account menu: its Headless UI code loads only after signing in.
const AccountMenu = lazy(() =>
  import("@/layouts/AccountMenu").then((module) => ({ default: module.AccountMenu })),
);

// Narrower headers drop items that have another way in: the wordmark goes home, and
// "Estrenos" is a rail on the home page. "¿Qué vemos?" never goes away.
const NAV = [
  { to: paths.home, label: "Inicio", end: true, from: "hidden xl:block" },
  { to: paths.movies, label: "Películas" },
  { to: paths.series, label: "Series" },
  { to: paths.releases, label: "Estrenos", from: "hidden lg:block" },
  { to: paths.myList, label: "Mi lista" },
];

/** The way into the recommender, on every screen size: a small amber-edged frame. */
const WhatToWatch = () => (
  <NavLink
    to={paths.recommender}
    className="inline-flex min-h-11 shrink-0 items-center rounded-aperture border border-edge px-3 text-small font-bold whitespace-nowrap text-edge hover:bg-edge hover:text-on-edge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge aria-[current=page]:bg-edge aria-[current=page]:text-on-edge"
  >
    ¿Qué vemos?
  </NavLink>
);

export const Wordmark = () => (
  <Link
    to={paths.home}
    className="rounded-perf font-display text-[1.75rem] leading-none font-extrabold tracking-[0.01em] whitespace-nowrap text-emulsion focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edge"
  >
    Pelicu<span className="text-edge">Led</span>
    <span className="sr-only">, inicio</span>
  </Link>
);

const SearchForm = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // The search page has its own, larger field.
  if (pathname === paths.search()) return null;
  return (
    <form
      role="search"
      // Takes the free space (up to 22rem) and gives it back first when the header is tight.
      className="relative hidden max-w-[22rem] min-w-0 flex-1 lg:ml-auto lg:block"
      onSubmit={(event) => {
        event.preventDefault();
        const query = new FormData(event.currentTarget).get("q")?.toString().trim();
        navigate(paths.search(query));
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        Buscar películas y series
      </label>
      <RiSearchLine
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-emulsion-muted"
      />
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={params.get("q") ?? ""}
        placeholder="Buscar películas y series"
        className="min-h-11 w-full rounded-aperture border border-control-line bg-acetate py-2 pr-3 pl-10 text-body text-emulsion placeholder:text-emulsion-subtle hover:border-emulsion-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
      />
    </form>
  );
};

/** Publishes the header's real height as --header-height, for things that stick under it. */
const useHeaderHeight = () => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = ref.current;
    if (!header || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) => {
      const height = entry?.borderBoxSize[0]?.blockSize ?? header.offsetHeight;
      root.style.setProperty("--header-height", `${height}px`);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  return ref;
};

export const SiteHeader = () => {
  const { user, loading } = useAuthContext();
  const ref = useHeaderHeight();

  return (
    <header ref={ref} className="sticky top-0 z-(--z-sticky) border-b border-frameline bg-leader">
      <div className="mx-auto flex max-w-(--container-reel) items-center gap-3 px-(--spacing-gutter) py-2 md:gap-5 lg:gap-6">
        <Wordmark />
        <nav aria-label="Principal" className="hidden shrink-0 md:block">
          <ul className="flex gap-1">
            {NAV.map((item) => (
              <li key={item.to} className={item.from}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={cn(
                    "relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-semibold whitespace-nowrap text-emulsion-muted hover:text-emulsion",
                    "rounded-perf focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge",
                    "after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:bg-transparent",
                    "aria-[current=page]:text-emulsion aria-[current=page]:after:bg-edge",
                  )}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <SearchForm />
        {/* Tablets: search is a destination (its page has the big field). */}
        <Link
          to={paths.search()}
          aria-label="Buscar"
          className={cn(
            buttonClasses({ variant: "ghost", size: "sm", iconOnly: true }),
            "ml-auto max-md:hidden lg:hidden",
          )}
        >
          <RiSearchLine aria-hidden />
        </Link>
        <div className="ml-auto flex shrink-0 items-center justify-end gap-3 md:ml-0 lg:ml-auto">
          <WhatToWatch />
          {loading ? (
            // Holds the width of "Ingresar" while the session is restored, so nothing shifts.
            <span
              aria-hidden
              className={cn(buttonClasses({ variant: "ghost", size: "sm" }), "invisible px-2.5")}
            >
              Ingresar
            </span>
          ) : user ? (
            <Suspense fallback={<span aria-hidden className="size-11" />}>
              <AccountMenu />
            </Suspense>
          ) : (
            <Link
              to={paths.signIn}
              className={buttonClasses({ variant: "ghost", size: "sm", className: "px-2.5" })}
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
