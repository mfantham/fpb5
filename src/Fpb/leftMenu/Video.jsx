import Button, { ButtonHolder, ListHolder } from "./Button";
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
    <ButtonHolder>
      <Button
        onClick={() => {
          newSequence();
        }}
        style={{ gridColumnEnd: "span 2" }}
      >
        New sequence
      </Button>
      <ListHolder>{sequenceButtons}</ListHolder>
    </ButtonHolder>
  );
};

export default Video;
