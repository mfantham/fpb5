import React from "react";
import styled from "styled-components";
import Button from "./Button";

const addBookmark = () => {
  console.log("add a bookmark");
};

const restoreBookmark = (position, label) => {
  console.log(`restore bookmark at ${position} annotated as ${label}`);
};

// These will come from localStorage
const browserBookmarks = [
  { label: "hello", position: "x: 10, y: 20" },
  { label: "world", position: "x: 5, y: 1" },
  { label: "goodbye", position: "x: 8, y: 3" }
];

export default ({ addBookmarkCallback, restoreBookmarkCallback }) => {
  const bookmarkButtons = browserBookmarks.map(({ position, label }, idx) => {
    return (
      <Button
        key={idx}
        onClick={() => {
          restoreBookmark(position, label);
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
