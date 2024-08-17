import React from "react";
import { SkeletonLoader } from "../../Pixmaps/SkeletonLoader/SkeletonLoader";
import classes from "./album.module.scss";
import { GalleryImage } from "../../../redux/features/albumsList/albumsListTypes";
import { onImageError } from "./utils";
import { useAppDispatch } from "../../../utils/hooks";
import { resetScrollOnBlur } from "../../../utils/commonUtils";

interface AlbumCoverProps
{
  isFetching: boolean;
  imageCover: GalleryImage;
}

export function AlbumCover({ isFetching, imageCover }: AlbumCoverProps): JSX.Element
{
  const dispatch = useAppDispatch();

  return isFetching ? (
    <div className={classes.galleryHeader__backgroundImage}>
      <SkeletonLoader />
    </div>
  ) : (
    <img
      src={imageCover?.url}
      alt={imageCover?.name}
      className={`${classes.galleryHeader__backgroundImage} ${classes.galleryHeader__backgroundImage_appearence}`}
      onError={onImageError.bind(null, dispatch, imageCover)}
      onClick={resetScrollOnBlur}
    />
  );
}