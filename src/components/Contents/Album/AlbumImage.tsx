import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import classes from "./album.module.scss";
import placeholderSrc from "../../../black.jpg";
import { FileLoadState, GalleryImage } from "../../../redux/features/albumsList/albumsListTypes";
import { valueDispatch } from "../../../utils/commonUtils";
import { useAppDispatch } from "../../../utils/hooks";
import { AppDispatch } from "../../../redux/reduxStore";
import { postImageTC, setCurrentViewId, updateSnapLoadState } from "../../../redux/features/album/albumSlice";
import { SkeletonLoader } from "../../Pixmaps/SkeletonLoader/SkeletonLoader";
import { RingProgressSVG } from "../../Pixmaps/RingProgress/RingProgressSVG";

export interface OwnProps {
  element: GalleryImage;
}

function onReUploadClicked(dispatch: AppDispatch, image: GalleryImage, abortController: AbortController)
{
  dispatch(postImageTC(image, abortController));
}

function onUploadCancelClicked(
  abortController: AbortController,
  setAbortController: (newController: AbortController) => void
)
{
  abortController.abort();
  setAbortController(new AbortController());
}

function onSnapImageError(dispatch: AppDispatch, galleryImage: GalleryImage)
{
  dispatch(updateSnapLoadState({
    ...galleryImage,
    loadState: FileLoadState.parsingFailed
  }));
}

export function GridImage({ element }: OwnProps) 
{
  const dispatch = useAppDispatch();
  const [abortController, setAbortController] = React.useState(new AbortController());
  const [imageUrl, setImageUrl] = React.useState<string>();

  React.useLayoutEffect(function()
  {
    setImageUrl(element?.url);
  }, [element?.url]);

  React.useEffect(
    function () 
    {
      if (element.loadState === FileLoadState.parsed) 
      {
        dispatch(postImageTC(element, abortController));
      }
    },
    [element.loadState, abortController]
  );

  let imageStateBlock: null | JSX.Element = null;
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
      <div
        className={
          element.loadState < FileLoadState.uploaded || element.loadState === FileLoadState.uploadFailed
            ? `${classes.galleryGrid__imageContainer} ${classes.galleryGrid__imageContainer_opacity}`
            : classes.galleryGrid__imageContainer
        }
      >
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
          onError={onSnapImageError.bind(null, dispatch, element)}
          src={imageUrl}
          onClick={(valueDispatch<string>).bind(null, dispatch, setCurrentViewId, element.id)}
          loading="lazy"
        />
      </div>
    );
  }

  if (element.loadState < FileLoadState.uploaded || element.loadState === FileLoadState.uploadFailed)
  {
    if (element.loadState < FileLoadState.uploaded)
    {
      imageStateBlock = (
        <div className={classes.galleryGrid__progressContainer}>
          <RingProgressSVG
            value={element.loadState}
            onClick={onUploadCancelClicked.bind(null, abortController, setAbortController)}
          />
        </div>
      );
    }
    else if (element.loadState === FileLoadState.uploadFailed)
    {
      imageStateBlock = (
        <div className={`${classes.galleryGrid__progressContainer} emojiFont`}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMinYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            className={classes.imageButton}
            onClick={onReUploadClicked.bind(null, dispatch, element, abortController)}
          >
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="60"
              className={classes.imageButton__text}
            >
              ⟳
            </text>
          </svg>
        </div>
      );
    }
  }

  return (
    // <div className={classes.galleryGrid__imageContainer}></div>
    <div key={element.id} className={classes.galleryGrid__imageWrapper}>
      {imgContents}
      {imageStateBlock}
    </div>
  );
}
