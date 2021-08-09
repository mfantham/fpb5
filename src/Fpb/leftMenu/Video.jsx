import React from "react";
import Button from "./Button";

const newSequence = () => {
  console.log("Open up sequence control... ");
};

const recordSequence = () => {
  console.log("Record a sequence");
};

const Video = () => {
  return (
    <>
      <Button
        onClick={() => {
          newSequence();
        }}
      >
        New sequence
      </Button>
      <Button
        onClick={() => {
          recordSequence();
        }}
      >
        Record sequence
      </Button>
    </>
  );
};

export default Video;
