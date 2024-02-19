import React from "react";
import classes from "./AlbumsList.module.scss";

interface AlbumArgument 
{
  navigate: Function;
  album: Album;
  setAlbumNumber: Function;
  scrollAlbumIndex: number;
  setScrollAlbumIndex: Function;
}

function onAlbumClicked(albumArgument: AlbumArgument) 
{
  albumArgument.setAlbumNumber(albumArgument.album.albumNumber, albumArgument.album.id);
  albumArgument.setScrollAlbumIndex(albumArgument.scrollAlbumIndex);
  albumArgument.navigate("detail?id=" + albumArgument.album.id);
}

function scrollToBlock(taskBlockCurrent: HTMLDivElement | null, smooth = false)
{
  if (taskBlockCurrent) 
  {
    if (smooth)
    {
      taskBlockCurrent.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    else 
    {
      taskBlockCurrent.scrollIntoView({ block: "nearest" });
    }
    taskBlockCurrent = null;
  }
}

function mapTaskComponents(
  taskBlockCurrentRef: React.RefObject<HTMLDivElement>,
  currentTaskIndex: number,
  halfPageSize: number,
  task: TaskBrief,
  index: number,
  taskArray: TaskBrief[]
) {
  //HTMLDivElement | null
  let nextScrollTaskIndex: number;
  if (index + halfPageSize > taskArray.length - 1) nextScrollTaskIndex = taskArray.length - 1;
  else nextScrollTaskIndex = index + halfPageSize;

  return (
    <AlbumBlock
      task={task}
      ref={currentTaskIndex === index ? taskBlockCurrentRef : null}
      nextScrollTaskIndex={nextScrollTaskIndex}
      key={task.taskNumber}
    />
  );
}

export function AlbumsList()
{
  let tasksComponents = taskArray.map(mapTaskComponents.bind(null,taskBlockCurrentRef,props.scrollTaskIndex,halfPageSize.current));

  return (
    <div
      className={classes.listWrapper}
      // onScroll={scrollHandler.bind(null, {
      //   newPageSize: pageSize.current + props.taskArray.length,
      //   getTaskList: props.getTaskList,
      //   searchParams: searchParams,
      //   setSearchParams: setSearchParams,
      //   taskBlockLoaderRef: taskBlockLoaderRef,
      //   fetchBlocked: fetchBlocked,
      //   setFetchBlocked: setFetchBlocked
      // })}
      ref={listBoxRef}
    >
      {tasksComponents}
      <div
        className={classes.albumBlock}
        ref={taskBlockLoaderRef}
        key={props.taskArray.length ? props.taskArray[props.taskArray.length - 1].taskNumber + 1 : 1}
      >
        {lastTaskBlock}
      </div>
    </div>
  );
}