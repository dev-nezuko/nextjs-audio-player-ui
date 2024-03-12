import React from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "quiet";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const BUTTON_VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-ink hover:bg-accent-strong font-semibold px-5 py-2",
  secondary:
    "border border-line text-paper hover:border-muted font-medium px-5 py-2",
  quiet:
    "text-muted hover:text-paper hover:bg-raised font-medium px-3 py-1.5 text-sm",
};

export const Button = ({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    {...props}
    className={twMerge(
      "inline-flex items-center justify-center gap-2 rounded-full transition-colors",
      "disabled:cursor-not-allowed disabled:opacity-60",
      BUTTON_VARIANTS[variant],
      className,
    )}
  />
);
