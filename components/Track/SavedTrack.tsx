import { FilteredTrack } from '@/types/sharedTypes';

interface Props {
  track: FilteredTrack;
}

export const SavedTrack: React.FC<Props> = ({ track: { image, name, artist, uri } }) => {
  return (
    <div
      className="flex bg-neutral-800 p-4 rounded-lg shadow-md hover:cursor-pointer transition-transform transform hover:scale-105 hover:bg-neutral-700"
      style={{ height: '120px' }}
    >
      <img src={image} alt={name} className="w-32 h-full object-cover mr-4 rounded-md" />
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-neutral-200 text-sm font-semibold mb-1 line-clamp-3">{name}</p>
          <p className="text-neutral-500 text-xs">{artist}</p>
        </div>
      </div>
    </div>
  );
};
