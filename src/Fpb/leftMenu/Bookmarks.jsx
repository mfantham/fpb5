import React from "react";
import styled from "styled-components";
import Button from "./Button";

import { defaultBookmark } from "../bookmarks/bookmarkObject"

export default ({
  addBookmarkCallback,
  restoreBookmarkCallback,
  useBookmarks
}) => {
  const {
    bookmark,
    addBookmark,
    restoreBookmark,
    arrayOfBookmarks
  } = useBookmarks;

  const bookmarkButtons = arrayOfBookmarks.map((bookmark, idx) => {
    return (
      <Button
        key={idx}
        onClick={() => {
          restoreBookmark(idx);
        }}
      >
        Restore bookmark {idx}
      </Button>
    );
  });
  return (
    <>
      <Button onClick={() => addBookmark()}>Add bookmark</Button>
      {bookmarkButtons}
    </>
  );
};
