import { PayloadAction, ThunkAction, UnknownAction, createSlice } from "@reduxjs/toolkit";
import { Album, AlbumsListState, GalleryImage } from "./albumsListTypes";
import { AppDispatch, RootState, SliceActions } from "../../reduxStore";
import { getAlbumsList, getAllTags } from "../../../api/apiAlbums";
import { DefinedTag } from "../../../api/apiTypes";

const initialState: AlbumsListState = {
  albums: [],
  searchString: "",
  searchTags: [],
  totalCount: 0,
  isFetching: false
};

export const albumsListSlice = createSlice({
  name: "AlbumsList",
  initialState,
  reducers: {
    setSearchString(state, action: PayloadAction<string>)
    {
      state.searchString = action.payload;
    },
    setIsFetching(state, action: PayloadAction<boolean>)
    {
      state.isFetching = action.payload;
    },
    setAlbums(state, action: PayloadAction<Album[]>)
    {
      state.albums = action.payload;
    },
    setTotalAlbumsCount(state, action: PayloadAction<number>)
    {
      state.totalCount = action.payload;
    },
    updateAlbumSnapLoadState(state, action: PayloadAction<{ albumId: string; image: GalleryImage }>)
    {
      for (const album of state.albums)
      {
        if (album.id === action.payload.albumId)
        {
          for (let i = 0; i < album.picturesSnap.length; i++) 
          {
            const pendingImage = album.picturesSnap[i];
            if (pendingImage.id === action.payload.image.id) 
            {
              album.picturesSnap[i] = {
                ...pendingImage,
                loadState: action.payload.image.loadState
              };
              break;
            }
          }
          break;
        }
      }
    },
    setSearchTags(state, action: PayloadAction<DefinedTag[]>)
    {
      state.searchTags = action.payload;
    }
  }
});

export function getAlbumsListTC(
  searchParams: URLSearchParams
): ThunkAction<Promise<void>, RootState, undefined, SliceActions<typeof albumsListSlice.actions>> 
{
  return async function (dispatch: AppDispatch) 
  {
    dispatch(albumsListSlice.actions.setIsFetching(true));
    const albumsResponse = await getAlbumsList(searchParams);
    dispatch(albumsListSlice.actions.setAlbums(albumsResponse.data.albumsList));
    dispatch(albumsListSlice.actions.setTotalAlbumsCount(albumsResponse.data.totalCount));
    dispatch(albumsListSlice.actions.setIsFetching(false));
  };
}

export function getSearchTagsTC(): ThunkAction<
Promise<void>,
RootState,
undefined,
SliceActions<typeof albumsListSlice.actions>
>
{
  return async function (dispatch: AppDispatch)
  {
    const tagsResponse = await getAllTags();
    if (tagsResponse.rc === 200)
    {
      dispatch(albumsListSlice.actions.setSearchTags(tagsResponse.data));
    }
  };
}

export const { setSearchString, setIsFetching, setAlbums, updateAlbumSnapLoadState, setSearchTags } =
  albumsListSlice.actions;