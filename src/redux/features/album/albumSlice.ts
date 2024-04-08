import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { Album, GalleryImage } from "../albumsList/albumsListTypes";
import { AlbumState } from "./albumTypes";
import { AppDispatch, RootState, SliceActions } from "../../reduxStore";
import { getAlbum } from "../../../api/apiAlbums";

const initialState: AlbumState = {
  albumData: {
    id: "",
    albumName: "Name",
    changedDate: new Date().toISOString(),
    picturesSnap: [],
    albumSize: 0,
    tags: []
  },
  images: [],
  currentViewId: "",
  isFetching: false
};

export const albumSlice = createSlice({
  name: "Album",
  initialState,
  reducers: {
    setImages(state, action: PayloadAction<GalleryImage[]>)
    {
      state.images = action.payload;
    },
    setAlbumData(state, action: PayloadAction<Album>)
    {
      state.albumData = action.payload;
    },
    setCurrentViewId(state, action: PayloadAction<string>)
    {
      state.currentViewId = action.payload;
    },
    updateSnapLoadState(state, action: PayloadAction<GalleryImage>)
    {
      for (let i = 0; i < state.albumData.picturesSnap.length; i++) 
      {
        const pendingImage = state.albumData.picturesSnap[i];
        if (pendingImage.id === action.payload.id) 
        {
          state.albumData.picturesSnap[i] = {
            ...pendingImage,
            loadState: action.payload.loadState
          };
          break;
        }
      }
    },
    updateImageLoadState(state, action: PayloadAction<GalleryImage>)
    {
      for (let i = 0; i < state.images.length; i++) 
      {
        const pendingImage = state.images[i];
        if (pendingImage.id === action.payload.id) 
        {
          state.images[i] = {
            ...pendingImage,
            loadState: action.payload.loadState
          };
          break;
        }
      }
    },
    setAlbumIsFetching(state, action: PayloadAction<boolean>)
    {
      state.isFetching = action.payload;
    }
  }
});

function progressLoadState(dispatch: AppDispatch, imageId: string, progressValue: number)
{
  const newImage: GalleryImage = {
    id: imageId,
    loadState: progressValue
  };
  dispatch(albumSlice.actions.updateSnapLoadState(newImage));
}

export function postImageTC(
  image: GalleryImage,
  abortController: AbortController
): ThunkAction<Promise<void>, RootState, undefined, SliceActions<typeof albumSlice.actions>> 
{
  return async function (dispatch: AppDispatch, getState: () => RootState)
  {
    // const rawImage = image?.data?.split?.("base64,")?.[1];
    // if (rawImage) {
    //   const currentTaskId = getState().tasks.currentID;
    //   const rc = await apiFetcher.postPhoto(
    //     {
    //       ID: currentTaskId,
    //       Name: image.name || "",
    //       Data: rawImage
    //     },
    //     progressLoadState.bind(null, dispatch, image.id),
    //     abortController
    //   );
    //   if (rc.status >= 400 || rc.status < 200) {
    //     progressLoadState(dispatch, image.id, FileLoadState.uploadFailed);
    //   } else {
    //     progressLoadState(dispatch, image.id, FileLoadState.uploaded);
    //   }
    // } else {
    //   progressLoadState(dispatch, image.id, FileLoadState.uploadFailed);
    // }
  };
}

export function getAlbumTC(
  albumId: string
): ThunkAction<Promise<void>, RootState, undefined, SliceActions<typeof albumSlice.actions>>
{
  return async function (dispatch: AppDispatch, getState: () => RootState)
  {
    dispatch(albumSlice.actions.setAlbumIsFetching(true));
    dispatch(albumSlice.actions.setImages([]));
    dispatch(
      albumSlice.actions.setAlbumData({
        id: "",
        albumName: "Name",
        changedDate: new Date().toISOString(),
        picturesSnap: [],
        albumSize: 0,
        tags: []
      })
    );
    const albumResponse = await getAlbum(albumId);
    if (albumResponse.data)
    {
      // const state = getState().album;
      // let resultImagesArray = [...state.images];
      // const newImages = albumResponse.data.picturesSnap.map(mapPhotos1cToImages);
      // if (resultImagesArray.length)
      // {
      //   const arrayLen = resultImagesArray.length;
      //   for (const newImage of albumResponse.data.picturesSnap)
      //   {
      //     let imageUpdated = false;
      //     for (let i = arrayLen - 1; i >= 0; i--)
      //     {
      //       let image = resultImagesArray[i];
      //       if (image.id === newImage.id)
      //       {
      //         image = { ...newImage };
      //         imageUpdated = true;
      //         break;
      //       }
      //     }
      //     if (!imageUpdated)
      //     {
      //       resultImagesArray.push(newImage);
      //     }
      //   }
      // }
      // else
      // {
      //   resultImagesArray = albumResponse.data.picturesSnap;
      // }

      dispatch(albumSlice.actions.setImages(albumResponse.data.images));
      dispatch(
        albumSlice.actions.setAlbumData({
          id: albumResponse.data.album.id,
          albumName: albumResponse.data.album.albumName,
          changedDate: albumResponse.data.album.changedDate,
          picturesSnap: albumResponse.data.album.picturesSnap,
          albumSize: albumResponse.data.album.albumSize,
          tags: albumResponse.data.album.tags
        })
      );
    }
    dispatch(albumSlice.actions.setAlbumIsFetching(false));
  };
}

export const {
  setImages,
  setAlbumData,
  setCurrentViewId,
  updateSnapLoadState,
  updateImageLoadState,
  setAlbumIsFetching
} = albumSlice.actions;