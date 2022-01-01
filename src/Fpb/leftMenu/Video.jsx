import Button, { ButtonHolder } from "./Button";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const recordSequence = () => {
  console.log("Record a sequence");
};

const Video = ({ useSequence }) => {
  const {
    arrayOfSequences,
    setEditingSequence,
    newSequence,
    playSequence,
  } = useSequence;

  const sequenceButtons = arrayOfSequences.map((sequence, idx) => {
    if (!!sequence) {
      return (
        <Fragment key={idx}>
          <Button
            onClick={() => {
              setEditingSequence(idx);
            }}
          >
            View/edit sequence {idx}
          </Button>
          <Button onClick={() => playSequence(idx)} circular>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
        </Fragment>
      );
    }
    return null;
  });

  return (
    <>
      <Button
        onClick={() => {
          newSequence();
        }}
        style={{ gridColumnEnd: "span 2" }}
      >
        New sequence
      </Button>
      <ButtonHolder
        style={{
          gridTemplateColumns: "1fr 32px",
          gridColumnEnd: "span 2",
          overflowY: "auto",
          maxHeight: 220,
          marginTop: 0,
        }}
      >
        {sequenceButtons}
      </ButtonHolder>
    </>
  );
};

export default Video;
