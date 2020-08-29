import React, { useCallback, useEffect, useState } from "react";
import { defaultBookmark } from "../bookmarks/bookmarkObject";

export const useBookmarks = () => {
  const [bookmark, setBookmark] = useState(defaultBookmark);
  const [bookmarkInCreation, setBookmarkInCreation] = useState({ idx: null });
  const [arrayOfBookmarks, setArrayOfBookmarks] = useState([defaultBookmark]);

  useEffect(() => {
    // Get bookmarks from browser
    const arrayOfBookmarks = [defaultBookmark, bookmark1, bookmark2];
    setArrayOfBookmarks(arrayOfBookmarks);
  }, []);

  const restoreBookmark = useCallback(
    idx => {
      if (idx === null || idx === undefined) {
        setBookmark(null);
      }
      setBookmark(arrayOfBookmarks[idx]);
    },
    [arrayOfBookmarks, setBookmark]
  );

  const addBookmark = () => {
    console.log("addBookmark was called :)");
    const newBookmark = bookmarkInCreation;
    newBookmark.idx = arrayOfBookmarks.length;
    setBookmarkInCreation(newBookmark);
  };

  const addToBookmark = (key, value) => {
    const newBookmark = bookmarkInCreation;
    newBookmark[key] = value;
    setBookmarkInCreation(newBookmark);
  };

  const saveBookmark = () => {
    const newArrayOfBookmarks = arrayOfBookmarks;
    newArrayOfBookmarks.push(bookmarkInCreation);
    setArrayOfBookmarks(newArrayOfBookmarks);
    setBookmarkInCreation({ idx: null });
  };

  return {
    bookmark,
    addBookmark,
    restoreBookmark,
    arrayOfBookmarks,
    bookmarkInCreation,
    addToBookmark,
    saveBookmark
  };
};

const bookmark1 = {
  // for testing
  camera: {
    position: {
      x: 1,
      y: 0,
      z: -3
    },
    rotation: {
      x: 0,
      y: -2.35,
      z: 0
    }
  },
  data: {
    rotation: {
      x: 0,
      y: 150,
      z: 0
    },
    rendering: {
      projection: 1,
      opacity: 0.5,
      intensity: 1,
      threshold: 0.2
    }
  },
  caption: "A bookmark for testing.",
  target: { moveTime: 0, moveType: "linear" }
};

const bookmark2 = {
  // for testing
  camera: {
    position: {
      x: -0.2,
      y: 0,
      z: -3
    },
    rotation: {
      x: 0,
      y: Math.PI,
      z: 0
    }
  },
  data: {
    rotation: {
      x: 0,
      y: -Math.PI / 4,
      z: 0
    },
    rendering: {
      projection: 0,
      opacity: 1,
      intensity: 1.5,
      threshold: 0.1
    }
  },
  caption:
    "A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. A long interesting caption about this interesting data. ",
  target: { moveTime: 0, moveType: "linear" }
};
