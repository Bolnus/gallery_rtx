import { updateImageLoadState } from "../../../redux/features/album/albumSlice";
import { FileLoadState, GalleryImage } from "../../../redux/features/albumsList/albumsListTypes";
import { AppDispatch } from "../../../redux/reduxStore";

export function onImageError(dispatch: AppDispatch, galleryImage: GalleryImage)
{
  dispatch(updateImageLoadState({
    ...galleryImage,
    loadState: FileLoadState.parsingFailed
  }));
}