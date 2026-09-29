import { RiSearchLine } from "@remixicon/react";
import { lazy, Suspense } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router";
import { paths } from "@/app/paths";
import { buttonClasses } from "@/components/ui/buttonClasses";
import { useAuthContext } from "@/features/auth/useAuthContext";
import { cn } from "@/lib/cn";

// Guests never see the account menu: its Headless UI code loads only after signing in.
const AccountMenu = lazy(() =>
  import("@/layouts/AccountMenu").then((module) => ({ default: module.AccountMenu })),
);

const NAV = [
  { to: paths.home, label: "Inicio", end: true },
  { to: paths.movies, label: "Películas" },
  { to: paths.series, label: "Series" },
  { to: paths.myList, label: "Mi lista" },
];

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
      className="relative ml-auto hidden w-[min(22rem,32vw)] md:block"
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

export const SiteHeader = () => {
  const { user, loading } = useAuthContext();

  return (
    <header className="sticky top-0 z-(--z-sticky) border-b border-frameline bg-leader">
      <div className="mx-auto flex max-w-(--container-reel) items-center gap-4 px-(--spacing-gutter) py-2 md:gap-8">
        <Wordmark />
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={cn(
                    "relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-semibold text-emulsion-muted hover:text-emulsion",
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
        <div className="ml-auto flex min-w-11 justify-end md:ml-0">
          {loading ? (
            // Holds the width of "Ingresar" while the session is restored, so nothing shifts.
            <span
              aria-hidden
              className={cn(buttonClasses({ variant: "ghost", size: "sm" }), "invisible")}
            >
              Ingresar
            </span>
          ) : user ? (
            <Suspense fallback={<span aria-hidden className="size-11" />}>
              <AccountMenu />
            </Suspense>
          ) : (
            <Link to={paths.signIn} className={buttonClasses({ variant: "ghost", size: "sm" })}>
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
