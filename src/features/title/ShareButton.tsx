import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import {
  RiFacebookCircleLine,
  RiLinkM,
  RiMailLine,
  RiMoreLine,
  RiShareForwardLine,
  RiTelegramLine,
  RiTwitterXLine,
  RiWhatsappLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonClasses";
import type { MediaType, TitleDetail } from "@/types/tmdb";
import {
  prefersNativeShare,
  shareData,
  shareLink,
  type ShareData,
  type ShareTarget,
} from "./share";

const itemClasses =
  "flex min-h-11 w-full items-center gap-3 rounded-perf px-3 text-left text-body text-emulsion " +
  "data-focus:bg-acetate-raised [&_svg]:size-5 [&_svg]:text-emulsion-muted";

const NETWORKS: { target: ShareTarget; label: string; Icon: RemixiconComponentType }[] = [
  { target: "whatsapp", label: "WhatsApp", Icon: RiWhatsappLine },
  { target: "telegram", label: "Telegram", Icon: RiTelegramLine },
  { target: "x", label: "X", Icon: RiTwitterXLine },
  { target: "facebook", label: "Facebook", Icon: RiFacebookCircleLine },
  { target: "email", label: "Email", Icon: RiMailLine },
];

const copyLink = async (data: ShareData, name: string) => {
  try {
    await navigator.clipboard.writeText(data.url);
    toast(`Copiaste el enlace de "${name}"`, { description: "Pegalo donde quieras." });
  } catch {
    toast.error("No pudimos copiar el enlace. Copialo desde la barra de direcciones.");
  }
};

/** Opens the system share sheet; if it fails for any reason but a cancel, copies the link. */
const shareNatively = async (data: ShareData, name: string) => {
  try {
    await navigator.share(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    await copyLink(data, name);
  }
};

interface ShareButtonProps {
  mediaType: MediaType;
  title: TitleDetail;
  name: string;
}

export const ShareButton = ({ mediaType, title, name }: ShareButtonProps) => {
  const data = shareData(mediaType, title, window.location.origin);
  const [native] = useState(() => prefersNativeShare(data));
  const canShare = typeof navigator.share === "function";

  if (native) {
    return (
      <Button variant="secondary" onClick={() => void shareNatively(data, name)}>
        <RiShareForwardLine aria-hidden />
        Compartir
      </Button>
    );
  }

  return (
    <Menu>
      <MenuButton
        className={buttonClasses({ variant: "secondary", className: "data-open:border-edge" })}
      >
        <RiShareForwardLine aria-hidden />
        Compartir
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        transition
        className="z-(--z-popover) mt-2 w-72 rounded-sheet border border-frameline bg-acetate p-1.5 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] transition duration-(--duration-fast) ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <p className="truncate px-3 pt-2 pb-2.5 font-code text-code text-emulsion-muted uppercase">
          Compartir {name}
        </p>
        <MenuItem>
          <button type="button" onClick={() => void copyLink(data, name)} className={itemClasses}>
            <RiLinkM aria-hidden />
            Copiar enlace
          </button>
        </MenuItem>
        <MenuSeparator className="mx-3 my-1.5 h-px bg-frameline" />
        {NETWORKS.map(({ target, label, Icon }) => (
          <MenuItem key={target}>
            <a
              href={shareLink(target, data)}
              {...(target === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className={itemClasses}
            >
              <Icon aria-hidden />
              {label}
            </a>
          </MenuItem>
        ))}
        {canShare && (
          <>
            <MenuSeparator className="mx-3 my-1.5 h-px bg-frameline" />
            <MenuItem>
              <button
                type="button"
                onClick={() => void shareNatively(data, name)}
                className={itemClasses}
              >
                <RiMoreLine aria-hidden />
                Más opciones
              </button>
            </MenuItem>
          </>
        )}
      </MenuItems>
    </Menu>
  );
};
