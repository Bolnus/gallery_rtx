import { Album, GalleryImage } from "../albumsList/albumsListTypes";

export interface AlbumState
{
  albumData: Album;
  images: GalleryImage[];
  currentViewId: string;
  isFetching: boolean;
}