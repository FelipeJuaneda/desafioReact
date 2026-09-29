import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { RiBookmarkLine, RiLogoutBoxRLine } from "@remixicon/react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { paths } from "@/app/paths";
import { authErrorMessage } from "@/features/auth/authErrors";
import { useAuthContext } from "@/features/auth/useAuthContext";

const itemClasses =
  "flex min-h-11 w-full items-center gap-3 rounded-perf px-3 text-left text-body text-emulsion " +
  "data-focus:bg-acetate-raised [&_svg]:size-5 [&_svg]:text-emulsion-muted";

export const AccountMenu = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  if (!user) return null;

  const name = user.displayName || user.email || "Tu cuenta";
  const initial = name.trim().charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(paths.home);
      toast("Cerraste sesión. Tu lista te espera cuando vuelvas.");
    } catch (error) {
      toast.error(authErrorMessage(error));
    }
  };

  return (
    <Menu>
      <MenuButton
        aria-label={`Cuenta de ${name}`}
        className="grid size-11 place-items-center rounded-full border border-control-line font-display text-xl font-extrabold text-emulsion hover:border-emulsion-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge data-open:border-edge"
      >
        {initial}
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        transition
        className="z-(--z-popover) mt-2 w-64 rounded-sheet border border-frameline bg-acetate p-1.5 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] transition duration-(--duration-fast) ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <p className="truncate px-3 pt-2 pb-2.5 text-small text-emulsion-muted">{name}</p>
        <MenuItem>
          <Link to={paths.myList} className={itemClasses}>
            <RiBookmarkLine aria-hidden />
            Mi lista
          </Link>
        </MenuItem>
        <MenuItem>
          <button type="button" onClick={handleLogout} className={itemClasses}>
            <RiLogoutBoxRLine aria-hidden />
            Cerrar sesión
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
