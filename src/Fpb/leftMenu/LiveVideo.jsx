import React, { useState } from "react";
import Button from "./Button";

export default () => {
  // This will have to be pulled up sometime
  const [isRecording, setIsRecording] = useState(false);

  const toggleLiveRecording = () => {
    setIsRecording(s => !s);
  }

  return (
    <Button onClick={() => toggleLiveRecording()} style={{width: "50%", marginLeft: "4px"}} disabled>
      {isRecording ? "Stop" : "Start"} recording
    </Button>
  );
};
