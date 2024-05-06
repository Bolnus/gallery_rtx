import React, { ChangeEvent, KeyboardEvent, KeyboardEventHandler } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import classes from "./album.module.scss";
import { Modal, ModalType } from "../../Modal/Modal";
import { GridImage } from "./AlbumImage";
import {
  invertTrigger,
  mapDefinedTagsToOptions,
  mapOptionsToDefinedTags,
  resetScrollOnBlur,
  valueDispatch
} from "../../../utils/commonUtils";
import { FileLoadState, GalleryImage } from "../../../redux/features/albumsList/albumsListTypes";
import { AppDispatch } from "../../../redux/reduxStore";
import { useAppDispatch, useTypedSelector } from "../../../utils/hooks";
import { SkeletonLoader } from "../../Pixmaps/SkeletonLoader/SkeletonLoader";
import {
  getAlbumTC,
  pushNewAlbumTag,
  putAlbumHeadersTC,
  setAlbumName,
  setAlbumTags,
  setUnsavedChanges,
  updateImageLoadState
} from "../../../redux/features/album/albumSlice";
import { SelectOption } from "../../../utils/commonTypes";
import { ApiMessage, DefinedTag } from "../../../api/apiTypes";
import { getSearchTagsTC } from "../../../redux/features/albumsList/albumsListSlice";
import { ChangesSaveState } from "../../../redux/features/album/albumTypes";
import { TextInput } from "../../controls/TextInput";

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

const canEdit = true;

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

function onCreateOption(
  dispatch: AppDispatch,
  inputValue: string
)
{
  dispatch(pushNewAlbumTag(inputValue));
}

function changeSelectedTags(
  dispatch: AppDispatch,
  newTags: readonly SelectOption[]
)
{
  dispatch(setAlbumTags(newTags.map(mapOptionsToDefinedTags)));
}

async function onSaveChanges(dispatch: AppDispatch, setErrorMessage: (message: ApiMessage | null) => void)
{
  const apiMessage = await dispatch(putAlbumHeadersTC());
  setErrorMessage(apiMessage);
}

function closeModal(setErrorMessage: (e: ApiMessage | null) => void)
{
  setErrorMessage(null);
}

export function Album() 
{
  const dispatch = useAppDispatch();
  const imageCover = useTypedSelector((state) => state.album.images?.[0]);
  const albumName = useTypedSelector((state) => state.album.albumData.albumName);
  const tags = useTypedSelector((state) => state.album.albumData.tags);
  const searchTags = useTypedSelector((state) => state.albumsList.searchTags);
  const isFetching = useTypedSelector((state) => state.album.isFetching);
  const images = useTypedSelector((state) => state.album.albumData.picturesSnap);
  const [searchParams] = useSearchParams();
  // const [modalVisible, setModalVisible] = React.useState(false);
  const unsavedChanges = useTypedSelector((state) => state.album.unsavedChanges);
  // const [loaderIds, setLoaderIds] = React.useState<string[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<ApiMessage | null>(null);
  const [isOnEdit, setIsOnEdit] = React.useState(false);
  
  let pageContents: JSX.Element;
  let albumCover: JSX.Element;

  React.useEffect(function ()
  {
    if (!isOnEdit) 
    {
      const requestID = String(searchParams.get("id"));
      dispatch(getAlbumTC(requestID));
    }
  }, [searchParams, isOnEdit, dispatch]);

  /** Init available tags list */
  React.useEffect(function()
  {
    dispatch(getSearchTagsTC());
  }, [dispatch]);

  // React.useEffect(function()
  // {
  //   const initialLoaderIds: string[] = [];
  //   for (let i = 0; i < 50; i++)
  //   {
  //     initialLoaderIds.push(String(i));
  //   }
  //   setLoaderIds(initialLoaderIds);
  // }, []);

  React.useEffect(function()
  {
    return function()
    {
      dispatch(setUnsavedChanges(ChangesSaveState.Saved));
    };
  }, []);
  
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
          {isOnEdit ? (
            <div className={classes.galleryHeader__leftContent}>
              <TextInput
                value={albumName}
                onChange={(valueDispatch<string>).bind(null, dispatch, setAlbumName)}
                isClearable
              />
            </div>
          ) : (
            <h1
              className={`${classes.galleryHeader__headerText}
              ${classes.galleryHeader__leftContent}`}
            >
              {isFetching ? "--" : albumName}
            </h1>
          )}
          {canEdit && (
            <div className={classes.toolBar}>
              {isOnEdit ? (
                <>
                  {unsavedChanges ? (
                    <button
                      onClick={onSaveChanges.bind(null, dispatch, setErrorMessage)}
                      className={`${classes.toolBar__button} ${classes.toolBar__button_isIcon} emojiFont pushButton`}
                      title="Save changes"
                    >
                      {unsavedChanges === ChangesSaveState.Unsaved ? "💾" : "⏳"}
                    </button>
                  ) : null}
                  <label className={classes.toolBar__inputWrapper}>
                    <input
                      type="file"
                      accept="image/*"
                      // value={props.fileName}
                      onChange={onFileInputChanged.bind(null, dispatch)}
                    />
                    <span
                      className={`${classes.toolBar__button} ${classes.toolBar__button_isIcon} pushButton emojiFont`}
                      title="Add images"
                      // onClick={editBlocked ? closeModal.bind(null, setErrorMessage) : () => {}}
                    >
                      ➕
                    </span>
                  </label>
                </>
              ) : null}
              <button
                onClick={invertTrigger.bind(null, isOnEdit, setIsOnEdit)}
                className={`${classes.toolBar__button} ${classes.toolBar__button_isIcon} emojiFont pushButton`}
                title="Edit"
              >
                {isOnEdit ? "⟳" : "✏️"}
              </button>
            </div>
          )}
        </div>
        <div className={classes.galleryContents}>
          <CreatableSelect
            options={searchTags.map(mapDefinedTagsToOptions)}
            isMulti
            value={tags.map(mapDefinedTagsToOptions)}
            onChange={changeSelectedTags.bind(null, dispatch)}
            onCreateOption={onCreateOption.bind(null, dispatch)}
            className={classes.reactSelectTagsWrapper}
            isClearable
            classNamePrefix="reactSelectTags"
            placeholder="Tags..."
            onBlur={resetScrollOnBlur}
            // inputValue={inputValue}
            // onInputChange={setInputValue}
            // onKeyDown={handleKeyDown.bind(null, inputValue, selectedTags, setSelectedTags, setInputValue)}
            isDisabled={!isOnEdit}
          />
          {pageContents}
        </div>
      </div>
      {errorMessage ? (
        <Modal
          onClose={closeModal.bind(null, setErrorMessage)}
          header={errorMessage.message}
          modalType={ModalType.Info}
        />
      ) : null}
    </div>
  );
}

