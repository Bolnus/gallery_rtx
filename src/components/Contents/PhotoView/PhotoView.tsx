import React from "react";
import Slider from "react-slick";
import {GalleryImage} from "../../../redux/features/albumsList/albumsListTypes";
import classes from "./PhotoView.module.scss";
import {invertTrigger, numberDispatch, stringDispatch} from "../../../utils/commonUtils";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Modal, ModalType} from "../../Modal/Modal";
import { useAppDispatch, useTypedSelector } from "../../../utils/hooks";
import { AppDispatch } from "../../../redux/reduxStore";
import { setCurrentViewId } from "../../../redux/features/album/albumSlice";

export interface StateProps
{
    images: GalleryImage[];
    currentViewId: string;
}

// export interface DispatchProps
// {
//     setCurrentViewId: Function
//     deleteImage: Function
// }

function mapViewImages(toolBarActive: boolean, setToolBarActive: Function, element: GalleryImage) 
{
  return (
    <div key={element.id} className={classes.imageWrapper}>
      <img
        alt={element.name || "not found"}
        src={element.data}
        onClick={invertTrigger.bind(null, toolBarActive, setToolBarActive)}
        // onClick={stringDispatch.bind(null,props.setCurrentViewId,props.element.id)}
      />
    </div>
  );
}

function deleteCurrentImage(imageId: string, deleteImage: Function, onClose: Function)
{
  deleteImage(imageId);
}

function onCloseClicked(dispatch: AppDispatch)
{
  dispatch(setCurrentViewId(""));
}

export function PhotoView() 
{
  const images = useTypedSelector((state) => state.album.images);
  const currentViewId = useTypedSelector((state) => state.album.currentViewId);
  const dispatch = useAppDispatch();

  const [imageIndex, setImageIndex] = React.useState(-1);
  const [toolBarActive, setToolBarActive] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(
    function () 
    {
      if (currentViewId) 
      {
        for (let i = 0; i < images.length; i++) 
        {
          if (images[i].id === currentViewId) 
          {
            setImageIndex(i);
          }
        }
      }
      else 
      {
        setImageIndex(-1);
      }
    },
    [currentViewId, images]
  );

  if (!currentViewId || imageIndex === -1) 
  {
    return null;
  }

  return (
    <div className={classes.photoViewBlock}>
      {toolBarActive ? (
        <>
          <div className={`${classes.photoViewToolBar} ${classes.photoViewToolBar_header}`}>
            <button
              onClick={onCloseClicked.bind(null, dispatch)}
              className={`${classes.photoViewToolBar__button} emojiFont`}
            >
              ❌
            </button>
          </div>
          <div className={`${classes.photoViewToolBar} ${classes.photoViewToolBar_footer}`}>
            {/* <button
              onClick={invertTrigger.bind(null, modalVisible, setModalVisible)}
              className={`${classes.photoViewToolBar__button} emojiFont`}
            >
              🗑️
            </button> */}
          </div>
        </>
      ) : null}
      <Slider
        vertical={false}
        arrows
        initialSlide={imageIndex}
        infinite={false}
        afterChange={numberDispatch.bind(null, setImageIndex)}
      >
        {images.map(mapViewImages.bind(null, toolBarActive, setToolBarActive))}
      </Slider>
      {/* {modalVisible ? (
        <Modal
          onClose={invertTrigger.bind(null, modalVisible, setModalVisible)}
          header="Удалить?"
          modalType={ModalType.DeleteDialog}
          onOk={deleteCurrentImage.bind(null, props.images[imageIndex]?.id, props.deleteImage)}
        />
      ) : null} */}
    </div>
  );
}