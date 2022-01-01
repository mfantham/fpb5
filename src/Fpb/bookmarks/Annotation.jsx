import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import {
  AnnotationDiv,
  AnnotationTextArea,
  CloseButton,
} from "../ui/AnnotationDiv";

const SLIDE_TIME = 400; // ms

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

const Annotation = ({ useBookmarks }) => {
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

export default Annotation;
