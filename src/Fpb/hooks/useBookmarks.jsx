import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "../../Website/useQuery";
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

  const queryParams = useQuery();
  const storageName = queryParams.get("demo") + "-bookmarks";

  useEffect(() => {
    let arrayOfBookmarks = [];

    // Get bookmark from URL
    const urlBookmark = (queryParams.get('b'));
    if (urlBookmark) {
      arrayOfBookmarks.push(urlBookmark);
      setBookmark(JSON.parse(atob(urlBookmark)));
    } else {
      arrayOfBookmarks.push(""); // So that bookmark 0 is reserved for url bookmark
    }

    const localBookmarks = JSON.parse(atob(localStorage.getItem(storageName)));
    localBookmarks.forEach(b => arrayOfBookmarks.push(b));

    // Then get bookmarks from browser localStorage...
    setArrayOfBookmarks(arrayOfBookmarks);
  }, []);

  const restoreBookmark = useCallback(
    idx => {
      setBookmarkInCreation({idx: null});
      if (idx === null || idx === undefined) {
        setBookmark(null);
        setBookmarkingState(BOOKMARK_STATE.DEFAULT);
      } else {
        const encodedBookmark = arrayOfBookmarks[idx];
        queryParams.set("b", encodedBookmark);
        window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`);

        const decodedBookmark = JSON.parse(atob(encodedBookmark));
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

    localStorage.setItem(storageName, btoa(JSON.stringify(newArrayOfBookmarks)));

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
