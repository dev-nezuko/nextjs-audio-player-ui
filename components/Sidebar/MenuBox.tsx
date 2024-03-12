import { twMerge } from "tailwind-merge";

import { ComponentProps } from "@/types/sharedTypes";

export const MenuBox: React.FC<ComponentProps> = ({ children, className }) => (
  <div className={twMerge("rounded-lg bg-surface", className)}>{children}</div>
);
