import Image from "next/image";

import { FilteredTrack } from "@/types/sharedTypes";

interface Props {
  track: FilteredTrack;
}

export const SavedTrack: React.FC<Props> = ({ track: { image, name, artist } }) => (
  <li className="flex items-center gap-3 rounded-md px-2 py-1.5">
    <div className="relative size-10 shrink-0 overflow-hidden rounded">
      <Image src={image} alt="" fill sizes="40px" className="object-cover" />
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-medium">{name}</p>
      <p className="truncate text-xs text-muted">{artist}</p>
    </div>
  </li>
);
