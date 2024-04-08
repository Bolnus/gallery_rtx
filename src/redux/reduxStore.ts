import { configureStore } from "@reduxjs/toolkit";
import { albumsListSlice } from "./features/albumsList/albumsListSlice";
import { albumSlice } from "./features/album/albumSlice";

// const reducers = combineReducers(reducersObject);
const storeOptions = {
  reducer: {
    albumsList: albumsListSlice.reducer,
    album: albumSlice.reducer
  }
};

export const store = configureStore(storeOptions); // , applyMiddleware(thunkMiddleWare)

// type ActionTypes = TasksActions | TaskListActions | AuthActions | GalleryActions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
// export type AppDispatch = ThunkDispatch<RootState, unknown, ActionTypes>;
export type SliceActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer A ? A : never;
}[keyof T]