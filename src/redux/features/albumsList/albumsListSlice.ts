import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Album, AlbumsListState } from "./albumsListTypes";

const initialState: AlbumsListState = {
  albums: [],
  searchString: "",
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
    }
  }
});
