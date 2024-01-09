export type Artist = {
  id: string;
  name: string;
};
export interface ArtistList {
  artists: ArtistListItem[];
}

export interface ArtistListItem {
  // Non-empty in API request and response
  id?: string;
  name: string;

  // Non-empty in API response
  versionstamp?: string;
  createdAt: number;
  updatedAt: number;
}
