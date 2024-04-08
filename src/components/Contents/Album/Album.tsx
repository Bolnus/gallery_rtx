import React, { ChangeEvent, KeyboardEvent, KeyboardEventHandler } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import classes from "./album.module.scss";
import { Modal, ModalType } from "../../Modal/Modal";
import { GridImage } from "./AlbumImage";
import { invertTrigger } from "../../../utils/commonUtils";
import { FileLoadState, GalleryImage } from "../../../redux/features/albumsList/albumsListTypes";
import { AppDispatch } from "../../../redux/reduxStore";
import { useAppDispatch, useTypedSelector } from "../../../utils/hooks";
import { SkeletonLoader } from "../../Pixmaps/SkeletonLoader/SkeletonLoader";
import { getAlbumTC, updateImageLoadState } from "../../../redux/features/album/albumSlice";
import { trackWindowScroll } from "react-lazy-load-image-component";
import { SelectOption } from "../../../utils/commonTypes";
import { DefinedTag } from "../../../api/apiTypes";

// export interface StateProps {
//   currentTaskNumber: number;
//   currentID: string;
//   date: string;
//   editBlocked: boolean;
//   images: GalleryImage[];
//   isFetching: boolean;
// }

// export interface DispatchProps {
//   addImage: Function;
//   setImageData: Function;
//   getGalleryPhotos: Function;
// }

function handleFileReadError(error: any)
{
  console.warn("Error parsing file", error);
}

function handleFileRead(fileId: string, dispatch: AppDispatch, event: ProgressEvent<FileReader>) 
{
  const fileReader = event.target;
  const imageWithData: GalleryImage = {
    id: fileId,
    data: String(fileReader?.result || ""),
    loadState: FileLoadState.parsed
  };
  // setImageData(imageWithData);
}

function onFileInputChanged(dispatch: AppDispatch, event: ChangeEvent<HTMLInputElement>) 
{
  const inputElement = event.target as HTMLInputElement;
  if (inputElement?.files?.length) 
  {
    const firstFile = inputElement.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(firstFile);
    const newFileId = uuidv4();
    reader.onload = handleFileRead.bind(null, newFileId, dispatch);
    reader.onerror = handleFileReadError;
    const galleryImage: GalleryImage = {
      id: newFileId,
      // url: URL.createObjectURL(firstFile),
      name: firstFile.name,
      type: firstFile.type,
      loadState: FileLoadState.added
    };
    // addImage(galleryImage);
  }
}

function mapImages(element: GalleryImage): JSX.Element
{
  return <GridImage element={element} key={element.id} />;
}

function mapLoaders(loaderId: string): JSX.Element
{
  return (
    <div key={loaderId} className={classes.galleryGrid__imageWrapper}>
      <div className={classes.galleryGrid__loaderWrapper}>
        <SkeletonLoader isSharp />
      </div>
    </div>
  );
}

function mapTagsToOptions(tag: DefinedTag): SelectOption
{
  return {
    value: tag.id,
    label: tag.tagName
  };
}

function onImageError(dispatch: AppDispatch, galleryImage: GalleryImage)
{
  dispatch(updateImageLoadState({
    ...galleryImage,
    loadState: FileLoadState.parsingFailed
  }));
}

function handleKeyDown(
  inputValue: string,
  selectedTags: SelectOption[],
  setSelectedTags: (newSelected: SelectOption[]) => void,
  setInputValue: (newValue: string) => void,
  localEvent: KeyboardEvent<HTMLDivElement>
): void
{
  if (!inputValue)
  {
    return;
  }
  const newOption = {
    label: inputValue,
    value: inputValue
  };

  switch (localEvent.key)
  {
  case "Enter":
  case "Tab":
    setSelectedTags([...selectedTags, newOption]);
    setInputValue("");
    localEvent.preventDefault();
  }
}

export function Album() 
{
  const dispatch = useAppDispatch();
  const imageCover = useTypedSelector((state) => state.album.images?.[0]);
  const albumName = useTypedSelector((state) => state.album.albumData.albumName);
  const tags = useTypedSelector((state) => state.album.albumData.tags);
  const isFetching = useTypedSelector((state) => state.album.isFetching);
  const images = useTypedSelector((state) => state.album.albumData.picturesSnap);
  const [searchParams] = useSearchParams();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loaderIds, setLoaderIds] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<SelectOption[]>([]);
  const editBlocked = true;
  let pageContents: JSX.Element;
  let albumCover: JSX.Element;

  React.useEffect(function ()
  {
    const requestID = String(searchParams.get("id"));
    dispatch(getAlbumTC(requestID));
  }, [searchParams]);

  React.useEffect(function()
  {
    const initialLoaderIds: string[] = [];
    for (let i = 0; i < 50; i++)
    {
      initialLoaderIds.push(String(i));
    }
    setLoaderIds(initialLoaderIds);
  }, []);

  const tagsOptions = React.useMemo(
    function () 
    {
      return tags.map(mapTagsToOptions);
    },
    [tags]
  );

  
  if (isFetching || images.length) 
  {
    pageContents = (
      <div className={classes.galleryGrid}>
        {images.map(mapImages)}
      </div>
    );
    albumCover = isFetching || imageCover.loadState === FileLoadState.parsingFailed ? (
      <div className={classes.galleryHeader__backgroundImage}>
        <SkeletonLoader />
      </div>
    ) : (
      <img
        src={imageCover?.url}
        alt={imageCover?.name}
        className={`${classes.galleryHeader__backgroundImage} ${classes.galleryHeader__backgroundImage_appearence}`}
        onError={onImageError.bind(null, dispatch, imageCover)}
      />
    );
  }
  else
  {
    pageContents = <div className="emptyComment">404 Not found</div>;
    albumCover = (
      <div className={classes.galleryHeader__backgroundImage}>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className={classes.galleryPage}>
      <div className={classes.scrollWrapper}>
        <div className={classes.galleryHeader}>
          {albumCover}
          <h1 className={classes.galleryHeader__headerText}>{albumName}</h1>
          <div className={classes.toolBar}>
            <label className={classes.toolBar__inputWrapper}>
              {editBlocked ? null : (
                <input
                  type="file"
                  accept="image/*"
                  // value={props.fileName}
                  onChange={onFileInputChanged.bind(null, dispatch)}
                />
              )}
              <span
                className={`${classes.toolBar__button} pushButton`}
                onClick={editBlocked ? invertTrigger.bind(null, modalVisible, setModalVisible) : () => {}}
              >
                <span className="emojiFont">+</span>
                Add
              </span>
            </label>
          </div>
        </div>
        <div className={classes.galleryContents}>
          <CreatableSelect
            options={tagsOptions}
            isMulti
            value={tagsOptions}
            isDisabled
            // onChange={onMultiSelectChange.bind(null, props.updateGroup)}
            className={classes.reactSelectTagsWrapper}
            isClearable
            classNamePrefix="reactSelectTags"
            placeholder="Tags..."
            // inputValue={inputValue}
            // onInputChange={setInputValue}
            // onKeyDown={handleKeyDown.bind(null, inputValue, selectedTags, setSelectedTags, setInputValue)}
          />
          {pageContents}
        </div>
      </div>
    </div>
  );
}

