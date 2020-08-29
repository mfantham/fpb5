import React, { useCallback, useEffect } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AnnotationDiv = styled.div`
  position: absolute;
  background-color: #2228;
  display: flex;
  padding: 16px 50px 16px 16px;
  color: white;
  backdrop-filter: blur(20px);
  border-radius: 8px;
  height: 100px;
  bottom: ${p => (p.open ? "65px" : "-165px")};
  width: 80vw;
  overflow: auto;
  left: 0;
  right: 0;
  margin: auto;

  transition: bottom 0.4s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  font-size: 1.4rem;
  color: white;
  bottom: ${p => (p.open ? "141px" : "-96px")};
  right: calc(10vw - 24px);
  width: 48px;
  height: 48px;
  border: 0;
  background: transparent;
  border-radius: 100vh;
  backdrop-filter: blur(20px);

  :hover {
    background: rgba(255, 255, 255, 0.5);
  }

  :focus {
    outline: 0;
  }

  transition: box-shadow 0.2s ease, background 0.2s ease, bottom 0.4s ease;
`;

export default ({ useBookmarks }) => {
  const {
    bookmark,
    addBookmark,
    restoreBookmark,
    bookmarkInCreation,
    saveBookmark,
    addToBookmark
  } = useBookmarks;
  const open = !!bookmark && !!bookmark.caption;

  const handleUserKeyPress = e => {
    if (bookmarkInCreation.idx !== null && e.key === "Enter") {
      addToBookmark("caption", "Test caption should come from input.");
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleUserKeyPress);
    return () => {
      window.removeEventListener("keypress", handleUserKeyPress);
    };
  }, [bookmarkInCreation.idx]);

  if (bookmarkInCreation.idx !== null) {
    console.log("should see annotation div now...");
    return (
      <AnnotationDiv open={true}>
        Adding bookmark {bookmarkInCreation.idx}... Input box will go here. Just
        press enter to save with default caption.
      </AnnotationDiv>
    );
  }

  return (
    <>
      <AnnotationDiv open={open}>{open && bookmark.caption}</AnnotationDiv>
      <CloseButton
        onClick={() => restoreBookmark(null)}
        title="Hide"
        open={open}
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </CloseButton>
    </>
  );
};
