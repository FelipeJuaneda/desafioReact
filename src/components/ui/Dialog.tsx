import {
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
} from "@headlessui/react";
import { RiCloseLine } from "@remixicon/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/** Modal with focus trap, Escape to close and scroll lock (Headless UI), in the projection world. */
export const Dialog = ({ open, onClose, title, children, className }: DialogProps) => (
  <HeadlessDialog open={open} onClose={onClose} className="relative z-(--z-dialog)">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-leader/85 transition-opacity duration-(--duration-slow) data-closed:opacity-0 motion-reduce:transition-none"
    />
    <div className="fixed inset-0 grid place-items-center p-(--spacing-gutter)">
      <DialogPanel
        transition
        className={cn(
          "grid w-full max-w-5xl gap-4 rounded-sheet border border-frameline bg-acetate p-4 sm:p-6",
          "transition duration-(--duration-slow) ease-out data-closed:scale-[0.98] data-closed:opacity-0",
          "motion-reduce:transition-none",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="font-display text-display-md font-extrabold text-emulsion uppercase">
            {title}
          </DialogTitle>
          <Button variant="ghost" iconOnly aria-label="Cerrar" onClick={onClose}>
            <RiCloseLine aria-hidden />
          </Button>
        </div>
        {children}
      </DialogPanel>
    </div>
  </HeadlessDialog>
);
