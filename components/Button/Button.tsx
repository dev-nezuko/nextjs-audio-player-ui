import React from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "round";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: IconType;
};

export const BUTTON_VARIANTS = {
  primary:
    "rounded-full bg-green-500 flex items-center justify-center cursor-pointer text-black font-bold hover:opacity-75 transition px-6 py-2",
  secondary:
    "rounded-full bg-white flex items-center justify-center cursor-pointer text-black font-bold hover:opacity-75 transition px-6 py-2",
  round:
    "rounded-full px-0 py-2 bg-neutral-900 flex items-center justify-center cursor-pointer hover:opacity-75 transition",
} as const;

export const Button = ({
  variant = "primary",
  icon: Icon,
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    {...props}
    className={twMerge(
      BUTTON_VARIANTS[variant],
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
  >
    {Icon ? <Icon className="text-neutral-300" size={20} /> : children}
  </button>
);
