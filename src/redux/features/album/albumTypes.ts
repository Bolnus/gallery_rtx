import { Album, GalleryImage } from "../albumsList/albumsListTypes";

export enum ChangesSaveState
{
  Saved = 0,
  Saving = 1,
  Unsaved = 2
}

export interface AlbumState
{
  albumData: Album;
  images: GalleryImage[];
  currentViewId: string;
  isFetching: boolean;
  unsavedChanges: ChangesSaveState;
}