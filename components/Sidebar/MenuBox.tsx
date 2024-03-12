import { twMerge } from 'tailwind-merge';

import { ComponentProps } from '@/types/sharedTypes';

export const MenuBox: React.FC<ComponentProps> = ({ children, className }) => {
  return <div className={twMerge('bg-neutral-900 rounded-lg h-fit w-full', className)}>{children}</div>;
};
