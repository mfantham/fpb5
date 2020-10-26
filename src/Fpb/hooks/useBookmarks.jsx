import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "../../Website/useQuery";
import { defaultBookmark } from "../bookmarks/bookmarkObject";

const fillCount = array => array.filter(e => !!e).length;

const BOOKMARK_STATE = {
  DEFAULT: 0,
  CREATING: 1,
  RESTORING: 2
};

export const useBookmarks = () => {
  const [bookmark, setBookmark] = useState(defaultBookmark);
  const [bookmarkInCreation, setBookmarkInCreation] = useState({ idx: null });
  const [arrayOfBookmarks, setArrayOfBookmarks] = useState([defaultBookmark]);
  const [bookmarkingState, setBookmarkingState] = useState(
    BOOKMARK_STATE.DEFAULT
  );
  const [nBookmarks, setNBookmarks] = useState(0);

  const queryParams = useQuery();
  const storageName = queryParams.get("demo") + "-bookmarks";

  useEffect(() => {
    let newArrayOfBookmarks = [];

    // Get bookmark from URL
    const urlBookmark = queryParams.get("b");
    if (urlBookmark) {
      newArrayOfBookmarks.push(urlBookmark);
      setBookmark(JSON.parse(atob(urlBookmark)));
    } else {
      newArrayOfBookmarks.push(""); // So that bookmark 0 is reserved for url bookmark
    }

    // Then get bookmarks from browser localStorage
    const localBookmarks = JSON.parse(
      atob(localStorage.getItem(storageName) ?? "W10=")
    );
    localBookmarks.forEach(b => newArrayOfBookmarks.push(b));

    setArrayOfBookmarks(newArrayOfBookmarks);
    setNBookmarks(fillCount(newArrayOfBookmarks));
  }, [storageName]);

  const restoreBookmark = useCallback(
    (idx, arrayOverwrite) => {
      setBookmarkInCreation({ idx: null });
      if (idx === null || idx === undefined) {
        setBookmark(null);
        setBookmarkingState(BOOKMARK_STATE.DEFAULT);
      } else {
        const encodedBookmark = !!arrayOverwrite
          ? arrayOverwrite[idx]
          : arrayOfBookmarks[idx];
        queryParams.set("b", encodedBookmark);
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${queryParams.toString()}`
        );

        const decodedBookmark = JSON.parse(atob(encodedBookmark));
        setBookmark(decodedBookmark);
        setBookmarkingState(BOOKMARK_STATE.RESTORING);
      }
    },
    [arrayOfBookmarks, setBookmark, nBookmarks]
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

  const putBookmarksInStorage = bookmarksToStore => {
    localStorage.setItem(storageName, btoa(JSON.stringify(bookmarksToStore)));
  };

  const saveBookmark = () => {
    const encodedBookmark = btoa(JSON.stringify(bookmarkInCreation));
    const newArrayOfBookmarks = [...arrayOfBookmarks];
    newArrayOfBookmarks.push(encodedBookmark);
    setArrayOfBookmarks(newArrayOfBookmarks);
    putBookmarksInStorage(newArrayOfBookmarks);

    restoreBookmark(bookmarkInCreation.idx, newArrayOfBookmarks);
    setBookmarkingState(BOOKMARK_STATE.RESTORING);
    setNBookmarks(fillCount(newArrayOfBookmarks));
  };

  const closeBookmark = () => {
    setBookmarkInCreation({ idx: null });
    restoreBookmark(null);
  };

  const deleteBookmark = idx => {
    const newArrayOfBookmarks = [...arrayOfBookmarks];
    newArrayOfBookmarks[idx] = "";
    setArrayOfBookmarks(newArrayOfBookmarks);
    putBookmarksInStorage(newArrayOfBookmarks);
    setNBookmarks(fillCount(newArrayOfBookmarks));
  };

  return {
    bookmark,
    addBookmark,
    restoreBookmark,
    deleteBookmark,
    arrayOfBookmarks,
    bookmarkInCreation,
    addToBookmark,
    saveBookmark,
    closeBookmark,
    nBookmarks
  };
};
