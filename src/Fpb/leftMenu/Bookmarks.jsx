import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Button, { ButtonHolder } from "./Button";

const Bookmarks = ({ useBookmarks }) => {
  const {
    bookmark,
    addBookmark,
    restoreBookmark,
    deleteBookmark,
    arrayOfBookmarks,
  } = useBookmarks;

  const bookmarkButtons = arrayOfBookmarks.map((bookmark, idx) => {
    if (!!bookmark) {
      return (
        <Fragment key={idx}>
          <Button
            onClick={() => {
              restoreBookmark(idx);
            }}
          >
            Restore bookmark {idx}
          </Button>
          <Button onClick={() => deleteBookmark(idx)} circular>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </Fragment>
      );
    }
    return null;
  });
  return (
    <>
      <ButtonHolder>
        <Button onClick={() => addBookmark()} style={{ gridColumn: "span 2" }}>
          Add bookmark
        </Button>
      </ButtonHolder>
      <ButtonHolder
        style={{
          gridTemplateColumns: "1fr 32px",
          overflowY: "auto",
          maxHeight: 220,
        }}
      >
        {bookmarkButtons}
      </ButtonHolder>
    </>
  );
};

export default Bookmarks;
