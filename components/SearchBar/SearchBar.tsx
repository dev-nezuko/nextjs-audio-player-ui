import { BiSearch } from "react-icons/bi";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SearchBar: React.FC<Props> = ({ value, onChange, disabled }) => (
  <div className="relative max-w-xl">
    <label htmlFor="track-search" className="sr-only">
      Search tracks by title, artist or album
    </label>
    <BiSearch
      aria-hidden
      size={20}
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
    />
    <input
      type="search"
      id="track-search"
      autoComplete="off"
      className="block w-full rounded-full border border-line bg-surface py-3 pl-12 pr-4 text-paper placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
      disabled={disabled}
      placeholder="Title, artist or album"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);
