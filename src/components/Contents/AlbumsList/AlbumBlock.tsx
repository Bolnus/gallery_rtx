import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import classes from "./AlbumsList.module.scss";
import { Album } from "../../../redux/features/albumsList/albumsListTypes";
import { useTypedSelector } from "../../../utils/hooks";

// export interface StateProps 
// {
//   currentAlbumNumber: number;
//   coffeeMachineFlag: boolean;
//   isCurrent: boolean;
// }

// export interface DispatchProps {
//   setAlbumNumber: Function;
//   setScrollAlbumIndex: Function;
// }

// export interface OwnProps 
// {
//   album: AlbumBrief;
//   nextScrollAlbumIndex: number;
// }

// type Props = StateProps & DispatchProps & OwnProps;

interface AlbumBlockProps 
{
  album: Album;
  isCurrent: boolean;
  onAlbumClicked: (albumId: string) => void;
}

const monthDict = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sen", "oct", "nov", "dec"];

function getBriefDate(timeT: string): string {
  const currentDate = new Date();
  const pendingDate = new Date(timeT);
  let briefDate = "";
  if (currentDate.toLocaleDateString() === pendingDate.toLocaleDateString()) 
  {
    briefDate = "today";
  }
  else 
  {
    briefDate = `${pendingDate.getDate()} ${monthDict[pendingDate.getMonth()]}`;
  }
  if (currentDate.getFullYear() !== pendingDate.getFullYear()) 
  {
    briefDate = `${briefDate} ${pendingDate.getFullYear()}`;
  }

  return briefDate;
}



export const AlbumBlock = React.forwardRef(function (
  { album, onAlbumClicked, isCurrent }: AlbumBlockProps,
  ref: React.ForwardedRef<HTMLDivElement>
) 
{
  // const navigate: NavigateFunction = useNavigate();
  // const currentAlbumId = useTypedSelector((state) => state.album.albumData.id);

  // React.useEffect(
  //   function () 
  //   {
  //     if (currentAlbumId === album.id) 
  //     {
  //       setTimeout(function () 
  //       {
  //         props.setAlbumNumber(0, "");
  //         props.setScrollAlbumIndex(-1);
  //       }, 500);
  //     }
  //   },
  //   [currentAlbumId]
  // );

  return (
    // <NavLink to={`./${album.id}`} key={album.albumNumber}> //&&transitionAppearFlag
    <div
      onClick={onAlbumClicked.bind(null, album.id)}
      ref={ref}
      className={`${classes.albumBlock} 
      ${classes.albumBlock_notLast} 
      ${isCurrent ? classes.albumBlock_current : ""}`}
    >
      <div className={classes.albumBlock__contents}>
        <div className={classes.albumBlock__header}>
          <span className={classes.albumBlock__name}>{album.albumName}</span>
          <span className={classes.albumBlock__time}>{getBriefDate(album.changedDate)}</span>
        </div>
        <p className={classes.albumBlock__address}>...</p>
      </div>
    </div>
    // </NavLink>
  );
});
