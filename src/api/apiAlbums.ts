import axios from "axios";
import { Album, FileLoadState, GalleryImage } from "../redux/features/albumsList/albumsListTypes";
import { ApiAlbum, AlbumWithImages, AlbumsListWithTotal, ApiAlbumsWithTotal, ApiResponse, DefinedTag, ApiTag } from "./apiTypes";

const baseURL = `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_PROXY_PORT || ""}`;
const axiosClient = axios.create({
  baseURL
});

// const baseEndPoint = "/gallery";

function handleResponseError(error: any, endPoint: string)
{
  console.warn(`Fetch error ${endPoint}: ${error?.code}`);
  if (error.hasOwnProperty("response")) 
  {
    if (error.response?.status === 401) 
    {
      localStorage.removeItem("AccessToken");
      window.location.href = "/auth";
    }
  }
}

function mapPictureIdToSnapRef(pictureId: string): GalleryImage
{
  return {
    id: pictureId,
    name: pictureId,
    url: `${baseURL}/albums_list/album/picture?id=${pictureId}&sizing=snap`,
    loadState: FileLoadState.downloaded
  };
}

function mapPictureIdToFullRef(pictureId: string): GalleryImage
{
  return {
    id: pictureId,
    name: pictureId,
    url: `${baseURL}/albums_list/album/picture?id=${pictureId}`,
    loadState: FileLoadState.downloaded
  };
}

function mapAlbums(albumApi: ApiAlbum): Album
{
  const album: Album = {
    id: albumApi._id,
    albumName: albumApi.albumName,
    changedDate: albumApi.changedDate,
    picturesSnap: [],
    albumSize: albumApi.albumSize,
    tags: albumApi.tags.map(mapTags)
  };
  if (albumApi.pictureIds.length)
  {
    album.picturesSnap = albumApi.pictureIds.map(mapPictureIdToSnapRef);
  }
  return album;
}

function mapTags(tagApi: ApiTag): DefinedTag
{
  return {
    tagName: tagApi.tagName,
    id: tagApi._id
  };
}

export async function getAlbumsList(searchParams: URLSearchParams): Promise<ApiResponse<AlbumsListWithTotal>>
{
  const path = "/albums_list";
  try
  {
    let outSearchParams: URLSearchParams;
    if (searchParams) 
    {
      outSearchParams = new URLSearchParams(searchParams.toString());
    }
    else
    {
      outSearchParams = new URLSearchParams();
    }
    // const expectedNumber = Number(outSearchParams.get("limit"));
    const queryString = outSearchParams.toString().replace(/\+/g, "%20");
    const response = await axiosClient.get<ApiAlbumsWithTotal>(`${path}?${queryString}`);

    return {
      rc: 200,
      data: {
        albumsList: response.data.albumsList.map(mapAlbums),
        totalCount: response.data.totalCount
      }
    };
  }
  catch (error: any)
  {
    handleResponseError(error, path);
    return {
      rc: Number(error?.code),
      data: {
        albumsList: [],
        totalCount: 0
      }
    };
  }
}

export async function getAlbum(albumId: string): Promise<ApiResponse<AlbumWithImages | null>>
{
  const path = "/albums_list/album";
  try
  {
    const response = await axiosClient.get<ApiAlbum>(`${path}?id=${albumId}`);
    return {
      rc: 200,
      data: {
        album: mapAlbums(response.data),
        images: response.data?.pictureIds.map(mapPictureIdToFullRef)
      }
    };
  }
  catch (error: any)
  {
    handleResponseError(error, path);
    return {
      rc: Number(error?.code),
      data: null
    };
  }
}

export async function getAllTags(): Promise<ApiResponse<DefinedTag[]>>
{
  const path = "/tags";
  try
  {
    const response = await axiosClient.get<ApiTag[]>(`${path}`);
    return {
      rc: 200,
      data: response.data.map(mapTags)
    };
  }
  catch (error: any)
  {
    handleResponseError(error, path);
    return {
      rc: Number(error?.code),
      data: []
    };
  }
}
