import Image from 'next/image';

import { FilteredTrack } from '@/types/sharedTypes';

interface Props {
  track: FilteredTrack;
}

export const SavedTrack: React.FC<Props> = ({ track: { image, name, artist } }) => {
  return (
    <div
      className="flex bg-neutral-800 p-4 rounded-lg shadow-md hover:cursor-pointer transition-transform transform hover:scale-105 hover:bg-neutral-700"
      style={{ height: '120px' }}
    >
      <div className="relative w-32 h-full mr-4 shrink-0">
        <Image src={image} alt="" fill sizes="128px" className="object-cover rounded-md" />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-neutral-200 text-sm font-semibold mb-1 line-clamp-3">{name}</p>
          <p className="text-neutral-500 text-xs">{artist}</p>
        </div>
      </div>
    </div>
  );
};
