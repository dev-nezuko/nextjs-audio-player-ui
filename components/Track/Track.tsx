import Image from "next/image";

import { useLibrary } from "@/contexts/LibraryContext";
import { FilteredTrack } from "@/types/sharedTypes";
import { AiOutlinePlus } from "react-icons/ai";

interface Props {
  track: FilteredTrack;
}

export const Track: React.FC<Props> = ({
  track: { image, name, artist, id },
}) => {
  const { addToLibrary } = useLibrary();

  return (
    <div className="bg-neutral-800 p-4 rounded-lg shadow-md hover:cursor-pointer transition-transform transform hover:scale-105 hover:bg-neutral-700">
      <div className="relative w-full h-32 mb-2">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover rounded-md"
        />
      </div>
      <p className="text-neutral-200 text-sm font-semibold mb-1">{name}</p>
      <div className="flex items-center justify-between">
        <p className="text-neutral-500 text-xs">{artist}</p>
        <button
          type="button"
          aria-label={`Save ${name} to library`}
          onClick={() => addToLibrary(id)}
        >
          <AiOutlinePlus
            className="text-neutral-400 cursor-pointer hover:text-white transition"
            size={20}
          />
        </button>
      </div>
    </div>
  );
};
