import React, { useRef, useState } from "react";

import Spinner from "../common/Spinner";
import Button from "./Button";

const RECORDING_STATES = {
  DEFAULT: 0,
  RECORDING: 1,
  SAVING: 2
}

const startRecording = (mediaRecorder, blobs) => {
  blobs.current = [];
  const chunkTime = 2000; // Recording will be saved in 2-second blobs
  const canvas = document.querySelector("canvas");
  const stream = canvas.captureStream(30);

  /* From https://github.com/webrtc/samples/blob/gh-pages/src/content/capture/canvas-record/js/main.js */
  let options = {mimeType: 'video/webm'};
  try {
    mediaRecorder.current = new MediaRecorder(stream, options);
  } catch (e0) {
    console.log('Unable to create MediaRecorder with options Object: ', e0);
    try {
      options = {mimeType: 'video/webm,codecs=vp9'};
      mediaRecorder.current = new MediaRecorder(stream, options);
    } catch (e1) {
      console.log('Unable to create MediaRecorder with options Object: ', e1);
      try {
        options = 'video/vp8'; // Chrome 47
        mediaRecorder.current = new MediaRecorder(stream, options);
      } catch (e2) {
        alert('MediaRecorder is not supported by this browser.\n\n' +
          'Try Firefox 29 or later, or Chrome 47 or later, ' +
          'with Enable experimental Web Platform features enabled from chrome://flags.');
        console.error('Exception while creating MediaRecorder:', e2);
        return;
      }
    }
  }

  mediaRecorder.current.ondataavailable = e => {
    if (e?.data?.size > 0) {
      blobs.current.push(e.data);
    }
  }
  mediaRecorder.current.onstop = () => {console.log("Recording finished; offering download")}
  mediaRecorder.current.start(chunkTime);

}

const stopRecording = async (mediaRecorder, blobs) => {
  mediaRecorder.current.stop();
  const superBlob = new Blob(blobs.current, {type: 'video/webm'});
  const videoUrl = URL.createObjectURL(superBlob);

  const link = document.createElement("a");
  link.href = videoUrl;
  link.download = "recording.webm";
  link.click();

  URL.revokeObjectURL(videoUrl);
}

export default () => {
  // This will have to be pulled up sometime
  const [recordingState, setRecordingState] = useState(RECORDING_STATES.DEFAULT);
  const mediaRecorder = useRef(null);
  const videoBlobs = useRef([]);

  const toggleLiveRecording = () => {
    if (recordingState === RECORDING_STATES.DEFAULT) {
      setRecordingState(RECORDING_STATES.RECORDING);
      startRecording(mediaRecorder, videoBlobs);
    } else if (recordingState === RECORDING_STATES.RECORDING) {
      setRecordingState(RECORDING_STATES.SAVING);
      stopRecording(mediaRecorder, videoBlobs).then(() => {
        setRecordingState(RECORDING_STATES.DEFAULT);
      });
    }
  }

  return (
    <Button onClick={() => toggleLiveRecording()} style={{width: "50%", marginLeft: "4px"}} disabled={recordingState === RECORDING_STATES.SAVING}>
      {recordingState === RECORDING_STATES.SAVING ? <Spinner /> : recordingState === RECORDING_STATES.RECORDING ? "Stop" : "Start"} recording
    </Button>
  );
};
