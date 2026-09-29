import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type PasswordFieldProps = Omit<ComponentProps<typeof Field>, "type" | "trailing" | "tone">;

/** Password input with a show/hide toggle (a real button: keyboard and screen readers get it). */
export const PasswordField = (props: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? RiEyeOffLine : RiEyeLine;
  return (
    <Field
      {...props}
      tone="lighttable"
      type={visible ? "text" : "password"}
      trailing={
        <Button
          variant="ghost"
          size="sm"
          tone="lighttable"
          iconOnly
          aria-label="Mostrar contraseña"
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          <Icon aria-hidden />
        </Button>
      }
    />
  );
};
