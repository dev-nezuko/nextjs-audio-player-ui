export const SavedTrackLoader = () => {
  return (
    <div
      className="flex bg-neutral-800 p-4 rounded-lg shadow-md hover:cursor-pointer transition-transform transform hover:scale-105 hover:bg-neutral-700"
      style={{ height: '120px' }}
    >
      <div className="w-32 h-full mr-4 rounded-md bg-neutral-600 animate-pulse"></div>

      <div className="flex flex-col justify-between w-full">
        <div className="mb-2">
          <div className="h-4 bg-neutral-600 w-3/4 animate-pulse"></div>
          <div className="h-4 bg-neutral-600 w-1/2 animate-pulse"></div>
          <div className="h-4 bg-neutral-600 w-2/3 animate-pulse"></div>
        </div>

        <div>
          <div className="h-3 bg-neutral-600 w-1/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
