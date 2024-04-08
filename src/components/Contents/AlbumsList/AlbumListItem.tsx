import React from "react";
import { NavLink, NavigateFunction, useNavigate } from "react-router-dom";
import classes from "./AlbumsList.module.scss";
import { Album, GalleryImage } from "../../../redux/features/albumsList/albumsListTypes";
import { useTypedSelector } from "../../../utils/hooks";
import { ImageSnap } from "./ImageSnap";
import { DefinedTag } from "../../../api/apiTypes";

interface AlbumListItemProps 
{
  album: Album;
  isCurrent: boolean;
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

function mapImages(albumId: string, element: GalleryImage): JSX.Element
{
  return <ImageSnap albumId={albumId} element={element} key={element.id} />;
}

function mapTags(tag: DefinedTag): JSX.Element
{
  return (
    <div className={`${classes.albumBlock__tagItem} reactSelectTags__multi-value`} key={tag.id}>
      <span className="reactSelectTags__multi-value__label">{tag.tagName}</span>
    </div>
  );
}

export const AlbumListItem = React.forwardRef(function (
  { album, isCurrent }: AlbumListItemProps,
  ref: React.ForwardedRef<HTMLDivElement>
) 
{
  return (
    <div className={classes.scrollBox_itemWrapper}>
      <NavLink to={`/album?id=${album.id}`} className={classes.navLink}>
        <div
          // onClick={onAlbumClicked.bind(null, album.id)}
          ref={ref}
          className={`${classes.albumBlock}       
      ${isCurrent ? classes.albumBlock_current : ""}`}
        >
          <div className={classes.albumBlock__picturesSnap}>
            {album.picturesSnap.map(mapImages.bind(null, album.id))}
          </div>
          <div className={classes.albumBlock__contents}>
            <div className={classes.albumBlock__header}>
              <span className={`${classes.albumBlock__name} ${isCurrent ? classes.albumBlock__name_current : ""}`}>
                {album.albumName}
              </span>
              <span className={classes.albumBlock__time}>{getBriefDate(album.changedDate)}</span>
            </div>
            <div className={classes.albumBlock__tags}>{album.tags.map(mapTags)}</div>
          </div>
        </div>
      </NavLink>
    </div>
  );
});
