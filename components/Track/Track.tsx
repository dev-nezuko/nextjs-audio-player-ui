import Image from "next/image";
import { BiCheck, BiPlus } from "react-icons/bi";

import { useLibrary } from "@/contexts/LibraryContext";
import { FilteredTrack } from "@/types/sharedTypes";

interface Props {
  track: FilteredTrack;
  position: number;
}

export const SaveButton = ({
  track,
  alwaysShowLabel = false,
}: {
  track: FilteredTrack;
  alwaysShowLabel?: boolean;
}) => {
  const { savedIds, savingId, addToLibrary } = useLibrary();
  const isSaved = savedIds.has(track.id);
  const isSaving = savingId === track.id;

  return (
    <button
      type="button"
      onClick={() => addToLibrary(track.id)}
      disabled={isSaved || isSaving}
      aria-label={
        isSaved ? `${track.name} is in your library` : `Save ${track.name} to library`
      }
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:border-transparent disabled:text-muted disabled:hover:text-muted"
    >
      {isSaved ? <BiCheck aria-hidden size={18} /> : <BiPlus aria-hidden size={18} />}
      <span className={alwaysShowLabel ? undefined : "hidden sm:inline"}>
        {isSaved ? "Saved" : isSaving ? "Saving…" : "Save"}
      </span>
    </button>
  );
};

export const Track: React.FC<Props> = ({ track, position }) => (
  <li className="grid grid-cols-[1.75rem_3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface md:grid-cols-[2rem_3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:gap-4">
    <span className="text-right text-sm tabular-nums text-muted">{position}</span>
    <div className="relative size-12 overflow-hidden rounded md:size-14">
      <Image src={track.image} alt="" fill sizes="56px" className="object-cover" />
    </div>
    <div className="min-w-0">
      <p className="truncate font-medium">{track.name}</p>
      <p className="truncate text-sm text-muted">{track.artist}</p>
    </div>
    <p className="hidden truncate font-display text-sm italic text-muted md:block">
      {track.albumName}
    </p>
    <SaveButton track={track} />
  </li>
);
