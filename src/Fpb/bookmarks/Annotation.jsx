import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SLIDE_TIME = 400; // ms

const AnnotationDiv = styled.div`
  position: absolute;
  background-color: #2228;
  display: flex;
  padding: 16px 50px 16px 16px;
  color: white;
  backdrop-filter: blur(20px);
  border-radius: 8px;
  height: 100px;
  bottom: ${(p) => (p.open ? "65px" : "-165px")};
  width: 80vw;
  overflow: auto;
  left: 0;
  right: 0;
  margin: auto;

  transition: bottom ${SLIDE_TIME}ms ease;
`;

const CloseButton = styled.button`
  position: absolute;
  font-size: 1.4rem;
  color: white;
  bottom: ${(p) => (p.open ? "141px" : "-96px")};
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

  transition: box-shadow 0.2s ease, background 0.2s ease,
    bottom ${SLIDE_TIME}ms ease;
`;

const AnnotationTextArea = styled.textarea`
  width: 100%;
  background: transparent;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  padding: 10px;
  font-family: inherit;
  outline: 0;
`;

const AnnotationInput = ({ useBookmarks }) => {
  const inputRef = useRef(null);
  const { bookmarkInCreation, saveBookmark, addToBookmark } = useBookmarks;

  const handleUserKeyPress = (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && inputRef.current) {
      addToBookmark("caption", inputRef.current.value);
      saveBookmark();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keypress", handleUserKeyPress);
      inputRef.current.addEventListener("keydown", (e) => e.stopPropagation());
      setTimeout(() => {
        inputRef.current.focus();
      }, SLIDE_TIME);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keypress", handleUserKeyPress);
        inputRef.current.removeEventListener("keydown", (e) =>
          e.stopPropagation()
        );
      }
    };
  }, [bookmarkInCreation.idx]);

  return (
    <AnnotationTextArea
      ref={inputRef}
      type="text"
      placeholder={`Add a caption for bookmark ${bookmarkInCreation.idx}, press enter to save...`}
    />
  );
};

export default ({ useBookmarks }) => {
  const {
    bookmark,
    restoreBookmark,
    closeBookmark,
    bookmarkInCreation,
  } = useBookmarks;
  const open = (!!bookmark && !!bookmark.caption) || !!bookmarkInCreation.idx;

  const annotationContents =
    bookmarkInCreation.idx !== null ? (
      <AnnotationInput useBookmarks={useBookmarks} />
    ) : (
      <>{open && bookmark.caption}</>
    );
  return (
    <>
      <AnnotationDiv open={open}>{annotationContents}</AnnotationDiv>
      <CloseButton onClick={() => closeBookmark()} title="Hide" open={open}>
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </CloseButton>
    </>
  );
};
