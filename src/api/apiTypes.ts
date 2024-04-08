import { Album, GalleryImage } from "../redux/features/albumsList/albumsListTypes";

export interface ApiAlbum
{
  _id: string;
	albumName: string;
	albumSize: number;
	changedDate: string;
	tags: ApiTag[];
	pictureIds: string[];
}

// export interface AlbumWithRefs extends Omit<ApiAlbum, "pictureIds">
// {
//   images: GalleryImage[];
// }

export interface ApiResponse<T>
{
  rc: number;
  data: T;
}

export interface AlbumWithImages
{
  album: Album;
  images: GalleryImage[];
}

export interface AlbumsListWithTotal
{
  albumsList: Album[];
  totalCount: number;
}

export interface ApiAlbumsWithTotal
{
	albumsList: ApiAlbum[];
  totalCount: number;
}

export interface ApiTag
{
  _id: string;
  tagName: string;
}

export interface DefinedTag
{
  id: string;
  tagName: string;
}
