interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  disabled,
  error,
}) => (
  <div>
    <label htmlFor="track-search" className="sr-only">
      Search
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-neutral-200"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="track-search"
        className="block w-full max-w-80 p-4 ps-10 text-sm text-neutral-100 border-transparent rounded-full bg-neutral-900 hover:border-gray-400 focus:ring-white focus:border-white focus:text-white transition-all"
        disabled={disabled}
        placeholder="Search Spotify tracks"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
    {error && <p role="alert">{error}</p>}
  </div>
);
