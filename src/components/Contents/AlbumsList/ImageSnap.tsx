import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import LazyLoad from "react-lazyload";
import "react-lazy-load-image-component/src/effects/blur.css";
import classes from "../Album/album.module.scss";
import placeholderSrc from "../../../black.jpg";
import { FileLoadState, GalleryImage } from "../../../redux/features/albumsList/albumsListTypes";
import { valueDispatch } from "../../../utils/commonUtils";
import { useAppDispatch } from "../../../utils/hooks";
import { AppDispatch } from "../../../redux/reduxStore";
import { postImageTC, setCurrentViewId, updateSnapLoadState } from "../../../redux/features/album/albumSlice";
import { SkeletonLoader } from "../../Pixmaps/SkeletonLoader/SkeletonLoader";
import { RingProgressSVG } from "../../Pixmaps/RingProgress/RingProgressSVG";
import { updateAlbumSnapLoadState } from "../../../redux/features/albumsList/albumsListSlice";

export interface OwnProps
{
  element: GalleryImage;
  albumId: string;
}

function onSnapImageError(dispatch: AppDispatch, galleryImage: GalleryImage, albumId: string)
{
  dispatch(
    updateAlbumSnapLoadState({
      albumId,
      image: {
        ...galleryImage,
        loadState: FileLoadState.parsingFailed
      }
    })
  );
}

export function ImageSnap({ element, albumId }: OwnProps) 
{
  const [imageUrl, setImageUrl] = React.useState<string>();
  const dispatch = useAppDispatch();

  React.useLayoutEffect(function()
  {
    setImageUrl(element?.url);
  }, [element?.url]);

  let imgContents: null | JSX.Element = null;

  if (element.loadState === FileLoadState.parsingFailed)
  {
    imgContents = (
      <div key={element.id} className={classes.galleryGrid__imageWrapper}>
        <div className={classes.galleryGrid__loaderWrapper}>
          <SkeletonLoader isSharp />
        </div>
      </div>
    );
  }
  else
  {
    imgContents = (
      <div className={classes.galleryGrid__imageContainer}>
        {/* <LazyLoadImage
          className={`${classes.galleryGrid__image} ${classes.galleryGrid__image_geometry}`}
          wrapperClassName={classes.galleryGrid__image_geometry}
          alt={element.name}
          onError={onSnapImageError.bind(null, dispatch, element)}
          src={imageUrl}
          onClick={(valueDispatch<string>).bind(null, dispatch, setCurrentViewId, element.id)}
          // placeholder={<SkeletonLoader isSharp />}
          // visibleByDefault
          // placeholderSrc={placeholderSrc}
          effect="blur"
        /> */}
        <img
          className={`${classes.galleryGrid__image} ${classes.galleryGrid__image_geometry}`}
          alt={element.name}
          onError={onSnapImageError.bind(null, dispatch, element, albumId)}
          src={imageUrl}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    // <div className={classes.galleryGrid__imageContainer}></div>
    <div key={element.id} className={classes.galleryGrid__imageWrapper}>
      {imgContents}
    </div>
  );
}
