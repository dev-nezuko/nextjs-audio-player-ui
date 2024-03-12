import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface MenuItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
  className,
}) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    className={twMerge(
      "flex items-center gap-3 rounded-md px-3 py-2 font-medium text-muted transition-colors hover:bg-raised hover:text-paper",
      active && "bg-raised text-paper",
      className,
    )}
  >
    <Icon aria-hidden size={20} className={active ? "text-accent" : undefined} />
    <span>{label}</span>
  </Link>
);
