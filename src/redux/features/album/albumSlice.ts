import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Album, GalleryImage } from "../albumsList/albumsListTypes";
import { AlbumState } from "./albumTypes";

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
  currentViewId: ""
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
    }
  }
});

export const { setImages, setAlbumData, setCurrentViewId } = albumSlice.actions;