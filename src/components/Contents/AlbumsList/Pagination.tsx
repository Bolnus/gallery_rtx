import React from "react";
import classes from "./AlbumsList.module.scss";
import { SkeletonLoader } from "../../Pixmaps/SkeletonLoader/SkeletonLoader";

export interface PaginationProps
{
  page: number;
  albumsCount: number;
  onPageSelect: (newPage: number) => void;
  isFetching: boolean;
  loadedAlbumsNumber: number;
  pageSize?: number;
}

function mapPaginationButtons(
  selected: number,
  onPageClicked: (newPage: number) => void,
  element: number,
  index: number
): JSX.Element
{
  return (
    <button
      key={index}
      className={`${classes.paginationButtonsBlock__button} 
      pushButton 
      ${selected === element ? classes.paginationButtonsBlock__button_selected : classes.paginationButtonsBlock__button_common}`}
      onClick={onPageClicked.bind(null, element)}
    >
      {element}
    </button>
  );
}

function mapLoaderButtons(
  selected: number,
  element: number
): JSX.Element
{
  return (
    <button
      key={element}
      className={`${classes.paginationButtonsBlock__button} 
      pushButton 
      ${classes.paginationButtonsBlock__button_selected}`}
    />
  );
}

const loaderIds = [1, 2, 3];

// function onPageClicked()

export function Pagination({
  page,
  albumsCount,
  onPageSelect,
  isFetching,
  loadedAlbumsNumber,
  pageSize = 50
}: PaginationProps) {
  const [paginationElements, setPaginationElements] = React.useState<number[]>([]);
  // const [currentLoaderId, setCurrentLoaderId] = React.useState<number>(1);

  React.useEffect(
    function () 
    {
      const newPaginationElements: number[] = [page];
      let albumsCovered = pageSize;
      for (let i = 0; i < 2; i++) {
        const currentLast = Number(newPaginationElements[newPaginationElements.length - 1]);
        const currentFirst = Number(newPaginationElements[0]);
        if (currentLast * pageSize < albumsCount && albumsCovered < albumsCount * pageSize) {
          newPaginationElements.push(currentLast + 1);
          albumsCovered = albumsCovered + pageSize;
        }
        if (currentFirst * pageSize - pageSize > 0 && albumsCovered < albumsCount * pageSize) {
          newPaginationElements.unshift(currentFirst - 1);
          albumsCovered = albumsCovered + pageSize;
        }
      }
      setPaginationElements(newPaginationElements);
    },
    [page, pageSize, albumsCount]
  );

  return (
    <div className={`${classes.pagination} ${classes.scrollBox_itemWrapper}`}>
      <div className={classes.pagination__label}>
        {isFetching ? <SkeletonLoader /> : null}
      </div>
      {isFetching ? (
        <div className={classes.paginationButtonsBlock}>{loaderIds.map(mapLoaderButtons)}</div>
      ) : (
        <div className={classes.paginationButtonsBlock}>
          <button
            key="first"
            className={`${classes.paginationButtonsBlock__button}
            ${classes.paginationButtonsBlock__button_common}
            emojiFont pushButton`}
            onClick={onPageSelect.bind(null, 1)}
          >
            ⏪
          </button>
          {paginationElements.map(mapPaginationButtons.bind(null, page, onPageSelect))}
          <button
            key="last"
            className={`${classes.paginationButtonsBlock__button}
            ${classes.paginationButtonsBlock__button_common}
            emojiFont pushButton`}
            onClick={onPageSelect.bind(null, Math.floor(albumsCount / pageSize) + 1)}
          >
            ⏩
          </button>
        </div>
      )}
      <div className={classes.pagination__label}>
        {isFetching ? <SkeletonLoader /> : <span>{`${loadedAlbumsNumber} / ${albumsCount}`}</span>}
      </div>
    </div>
  );
}