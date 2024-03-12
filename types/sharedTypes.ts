export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface TrackType {
  id: string;
  name: string;
  uri: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

export interface FilteredTrack {
  id: string;
  name: string;
  uri: string;
  image: string;
  albumName: string;
  artist: string;
}
