import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Button, { ButtonHolder } from "./Button";

export default ({ useBookmarks }) => {
  const {
    bookmark,
    addBookmark,
    restoreBookmark,
    deleteBookmark,
    arrayOfBookmarks
  } = useBookmarks;

  const bookmarkButtons = arrayOfBookmarks.map((bookmark, idx) => {
    if (!!bookmark) {
      return (
        <ButtonHolder key={idx}>
          <Button
            onClick={() => {
              restoreBookmark(idx);
            }}
          >
            Restore bookmark {idx}
          </Button>
          <Button onClick={() => deleteBookmark(idx)} circular style={{marginLeft: "8px"}}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </ButtonHolder>
      );
    }
  });
  return (
    <>
      <ButtonHolder>
        <Button onClick={() => addBookmark()}>Add bookmark</Button>
      </ButtonHolder>
      {bookmarkButtons}
    </>
  );
};
