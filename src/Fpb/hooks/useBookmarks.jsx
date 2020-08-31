import React, { useCallback, useEffect, useState } from "react";
import { defaultBookmark } from "../bookmarks/bookmarkObject";

const BOOKMARK_STATE = {
  DEFAULT: 0,
  CREATING: 1,
  RESTORING: 2
}

export const useBookmarks = () => {
  const [bookmark, setBookmark] = useState(defaultBookmark);
  const [bookmarkInCreation, setBookmarkInCreation] = useState({ idx: null });
  const [arrayOfBookmarks, setArrayOfBookmarks] = useState([defaultBookmark]);

  const [bookmarkingState, setBookmarkingState] = useState(BOOKMARK_STATE.DEFAULT);

  useEffect(() => {
    // Get bookmarks from browser
    const arrayOfBookmarks = [defaultBookmark];
    setArrayOfBookmarks(arrayOfBookmarks);
  }, []);

  const restoreBookmark = useCallback(
    idx => {
      setBookmarkInCreation({idx: null});
      if (idx === null || idx === undefined) {
        setBookmark(null);
        setBookmarkingState(BOOKMARK_STATE.DEFAULT);
      } else {
        const decodedBookmark = JSON.parse(atob(arrayOfBookmarks[idx]));
        setBookmark(decodedBookmark);
        setBookmarkingState(BOOKMARK_STATE.RESTORING);
      }
    },
    [arrayOfBookmarks, setBookmark]
  );

  const addBookmark = () => {
    const newBookmark = bookmarkInCreation;
    newBookmark.idx = arrayOfBookmarks.length;
    setBookmarkInCreation(newBookmark);
    setBookmarkingState(BOOKMARK_STATE.CREATING);
  };

  const addToBookmark = (key, value) => {
    const newBookmark = bookmarkInCreation;
    newBookmark[key] = value;
    setBookmarkInCreation(newBookmark);
  };

  const saveBookmark = () => {
    const encodedBookmark = btoa(JSON.stringify(bookmarkInCreation));
    const newArrayOfBookmarks = arrayOfBookmarks;
    newArrayOfBookmarks.push(encodedBookmark);
    setArrayOfBookmarks(newArrayOfBookmarks);
    restoreBookmark(bookmarkInCreation.idx);
    setBookmarkingState(BOOKMARK_STATE.RESTORING);
  };

  const closeBookmark = () => {
    setBookmarkInCreation({ idx: null});
    restoreBookmark(null);
  }

  return {
    bookmark,
    addBookmark,
    restoreBookmark,
    arrayOfBookmarks,
    bookmarkInCreation,
    addToBookmark,
    saveBookmark,
    closeBookmark
  };
};

// const bookmark1 = {
//   // for testing
//   camera: {
//     position: {
//       x: 1,
//       y: 0,
//       z: -3
//     },
//     rotation: {
//       x: 0,
//       y: -2.35,
//       z: 0
//     }
//   },
//   data: {
//     rotation: {
//       x: 0,
//       y: 150,
//       z: 0
//     },
//     rendering: {
//       projection: 1,
//       opacity: 0.5,
//       intensity: 1,
//       threshold: 0.2
//     }
//   },
//   caption: "A bookmark for testing.",
//   target: { moveTime: 0, moveType: "linear" }
// };
//
// const bookmark2 = {
//   // for testing
//   camera: {
//     position: {
//       x: -0.2,
//       y: 0,
//       z: -3
//     },
//     rotation: {
//       x: 0,
//       y: 3.14159,
//       z: 0
//     }
//   },
//   data: {
//     rotation: {
//       x: 0,
//       y: -3.14159 / 4,
//       z: 0
//     },
//     rendering: {
//       projection: 0,
//       opacity: 1,
//       intensity: 1.5,
//       threshold: 0.1
//     }
//   },
//   caption:
//     "A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. ",
//   target: { moveTime: 0, moveType: "linear" }
// };
