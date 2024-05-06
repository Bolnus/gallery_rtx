import React from "react";
import { NavigateFunction, useNavigate, useSearchParams } from "react-router-dom";
import Select, { MultiValue } from "react-select";
import classes from "./AlbumsList.module.scss";
import { Album } from "../../../redux/features/albumsList/albumsListTypes";
import { AlbumListItem } from "./AlbumListItem";
import { useAppDispatch, useDebounce, useTypedSelector } from "../../../utils/hooks";
import { getAlbumsListTC, getSearchTagsTC, setIsFetching } from "../../../redux/features/albumsList/albumsListSlice";
import { Pagination } from "./Pagination";
import { DEFAULT_PAGE_SIZE } from "../../../utils/localStorageUtils";
import { SelectOption } from "../../../utils/commonTypes";
import { DefinedTag } from "../../../api/apiTypes";
import {
  mapDefinedTagsToOptions,
  mapOptionToLabel,
  mapValueToOption,
  resetScrollOnBlur,
  setStateOnInputChange
} from "../../../utils/commonUtils";
import { TextInput } from "../../controls/TextInput";
import { SkeletonLoader } from "../../Pixmaps/SkeletonLoader/SkeletonLoader";

const halfClientPageSize = 2;
const PAGE_PARAM = "page";
const SIZE_PARAM = "size";
const TAGS_PARAM = "tags";
const NAME_PARAM = "name";

interface AlbumListProps
{
  isSearch?: boolean;
}

function onAlbumClicked(navigate: NavigateFunction, albumId: string) 
{
  navigate(`album?id=${albumId}`);
}

function mapAlbumToBlock(
  scrollAlbumBlockRef: React.RefObject<HTMLDivElement>,
  currentAlbumId: string,
  scrollBlockNumber: number,
  album: Album,
  index: number,
  // albumsList: Album[],
) 
{
  return (
    <AlbumListItem
      album={album}
      isCurrent={album.id === currentAlbumId}
      ref={scrollBlockNumber === index ? scrollAlbumBlockRef : null}
      key={album.id}
    />
  );
}

function scrollToDiv(divBlock: HTMLDivElement | null, smooth = false)
{
  if (divBlock) 
  {
    divBlock.scrollIntoView({ block: "nearest", behavior: smooth ? "smooth" : undefined });
    // divBlock = null;
  }
}

function changeSearchName(
  setSearchName: (str: string) => void,
  setPageNumber: (newPage: number) => void,
  newValue: string
)
{
  setPageNumber(1);
  setSearchName(newValue);
}

export function AlbumsList({ isSearch }: AlbumListProps)
{
  const dispatch = useAppDispatch();
  const albums = useTypedSelector((state) => state.albumsList.albums);
  const currentAlbumId = useTypedSelector((state) => state.album.albumData.id);
  const totalCount = useTypedSelector((state) => state.albumsList.totalCount);
  const searchTags = useTypedSelector((state) => state.albumsList.searchTags);
  const isFetching = useTypedSelector((state) => state.albumsList.isFetching);
  const scrollAlbumBlockRef = React.useRef<HTMLDivElement>(null);
  const listBoxRef = React.useRef<HTMLDivElement>(null);
  const [scrollBlockNumber, setScrollBlockNumber] = React.useState(-1);
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearchParams = useDebounce<URLSearchParams>(searchParams, 500);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [selectedTags, setSelectedTags] = React.useState<readonly SelectOption[]>([]);
  const [searchName, setSearchName] = React.useState<string>("");

  /** Selected block number update */
  React.useEffect(function()
  {
    const listBox = listBoxRef.current as HTMLDivElement;
    if (listBox)
    {
      let nextScrollAlbumIndex = 0;
      let currentAlbumIndex = 0;
      for (let i = 0; i < albums.length; i++)
      {
        if (albums[i].id === currentAlbumId)
        {
          currentAlbumIndex = i;
          break;
        }
      }
      if (currentAlbumIndex)
      {
        if (currentAlbumIndex + halfClientPageSize > albums.length - 1) 
        {
          nextScrollAlbumIndex = albums.length - 1;
        }
        else 
        {
          nextScrollAlbumIndex = currentAlbumIndex + halfClientPageSize;
        }
      }
      setScrollBlockNumber(nextScrollAlbumIndex);
    }
  }, [listBoxRef, albums, currentAlbumId]);

  /** Scroll to selected block after page inited */
  React.useLayoutEffect(function()
  {
    if (listBoxRef.current)
    {
      scrollToDiv(scrollAlbumBlockRef.current);
    }
  }, [scrollAlbumBlockRef.current, listBoxRef.current]);

  /** Init state hooks with query params */
  React.useEffect(function()
  {
    const newPage = searchParams.get(PAGE_PARAM);
    const newPageSize = searchParams.get(SIZE_PARAM);
    const tagsStr = searchParams.get(TAGS_PARAM);
    const nameStr = searchParams.get(NAME_PARAM);
    if (newPage)
    {
      setPageNumber(Number(newPage));
    }
    else
    {
      setPageNumber(1);
    }
    if (newPageSize)
    {
      setPageSize(Number(newPageSize));
    }
    else
    {
      setPageSize(DEFAULT_PAGE_SIZE);
    }
    if (tagsStr)
    {
      const tagsArray = tagsStr.split(",");
      setSelectedTags(tagsArray.map(mapValueToOption));
    }
    else
    {
      setSelectedTags([]);
    }
    if (nameStr)
    {
      setSearchName(nameStr);
    }
    else
    {
      setSearchName("");
    }
  }, []);

  /** Fetch albums list on query params update */
  React.useEffect(function()
  {
    dispatch(getAlbumsListTC(debouncedSearchParams));
    // .then(function()
    // {
    //   scrollToDiv(scrollAlbumBlockRef.current, true);
    // });
  }, [debouncedSearchParams, dispatch]);

  /** Init available tags list */
  React.useEffect(function()
  {
    dispatch(getSearchTagsTC());
  }, [dispatch]);

  /** Update query params based on state variables */
  React.useEffect(function()
  {
    const newSearchParams = new URLSearchParams();
    if (!selectedTags.length || !isSearch)
    {
      newSearchParams.delete(TAGS_PARAM);
    }
    else
    {
      const tagsStr = selectedTags.map(mapOptionToLabel).join(",");
      newSearchParams.set(TAGS_PARAM, tagsStr);
    }
    if (!searchName || !isSearch)
    {
      newSearchParams.delete(NAME_PARAM);
    }
    else
    {
      newSearchParams.set(NAME_PARAM, searchName);
    }
    newSearchParams.set(PAGE_PARAM, String(pageNumber));
    newSearchParams.set(SIZE_PARAM, String(pageSize));
    
    setSearchParams(newSearchParams);
  }, [selectedTags, setSearchParams, isSearch, pageNumber, pageSize, searchName]);

  /** Set page number */
  const onPageSelect = React.useCallback(function(newPage: number)
  {
    setPageNumber(newPage);
    if (newPage !== pageNumber)
    {
      dispatch(setIsFetching(true));
    }
    listBoxRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [setPageNumber, dispatch, listBoxRef, pageNumber]);

  const albumBlockComponents = albums.map(
    mapAlbumToBlock.bind(null, scrollAlbumBlockRef, currentAlbumId, scrollBlockNumber)
  );

  const onTagsSelectionChange = React.useCallback(function(newValue: MultiValue<SelectOption>)
  {
    setPageNumber(1);
    setSelectedTags(newValue);
  }, [setPageNumber, setSelectedTags]);

  return (
    <div className={`${classes.albumsListPage}`}>
      <div className={classes.scrollBox} ref={listBoxRef}>
        {isSearch ? (
          <div className={`${classes.searchBlock} ${classes.scrollBox_itemWrapper}`}>
            <div className={`${classes.inputWrapper}`}>
              <TextInput
                value={searchName}
                onChange={changeSearchName.bind(null, setSearchName, setPageNumber)}
                isClearable
              />
            </div>
            <Select
              options={searchTags.map(mapDefinedTagsToOptions)}
              isMulti
              value={selectedTags}
              onChange={onTagsSelectionChange}
              className={classes.inputWrapper}
              isClearable
              classNamePrefix="reactSelectTags"
              placeholder="Tags..."
              onBlur={resetScrollOnBlur}
              // menuIsOpen
            />
          </div>
        ) : null}
        {albums.length ? (
          <Pagination
            albumsCount={totalCount}
            page={pageNumber}
            pageSize={pageSize}
            onPageSelect={onPageSelect}
            loadedAlbumsNumber={albums.length}
            isFetching={isFetching}
          />
        ) : null}
        {albumBlockComponents}
        {albumBlockComponents?.length ? null : (
          <div
            className={`${classes.albumBlock} ${classes.scrollBox_itemWrapper}`}
            // ref={taskBlockLoaderRef}
            key="last"
          >
            {isFetching ? (
              <div>
                <SkeletonLoader />
              </div>
            ) : (
              <div className="emptyComment">Not found</div>
            )}
          </div>
        )}
        {albums.length ? (
          <Pagination
            albumsCount={totalCount}
            page={pageNumber}
            pageSize={pageSize}
            onPageSelect={onPageSelect}
            loadedAlbumsNumber={albums.length}
            isFetching={isFetching}
          />
        ) : null}
      </div>
    </div>
  );
}