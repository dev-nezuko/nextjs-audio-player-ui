import { FilteredTrack } from "@/types/sharedTypes";
import { TracksLoader } from "../SkeletonLoader/TracksLoader";
import { Track } from "../Track/Track";

interface Props {
  tracks: FilteredTrack[];
  isLoading: boolean;
  label: string;
}

export const TrackList: React.FC<Props> = ({ tracks, isLoading, label }) =>
  isLoading ? (
    <div role="status" aria-label={`Loading ${label}`}>
      {Array.from({ length: 6 }, (_, index) => (
        <TracksLoader key={`loader-${index}`} />
      ))}
    </div>
  ) : (
    <ol aria-label={label} className="flex flex-col">
      {tracks.map((track, index) => (
        <Track track={track} position={index + 1} key={track.id} />
      ))}
    </ol>
  );
