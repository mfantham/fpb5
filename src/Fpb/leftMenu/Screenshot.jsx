import React from "react";
import styled from "styled-components";
import Button from "./Button";

const takeScreenshot = () => {
  const canvas = document.getElementsByTagName("canvas")[0]; // very unreactful :(
  const link = document.createElement("a");
  link.download = "screenshot.png";

  canvas.toBlob(blob => {
    link.href = URL.createObjectURL(blob);
    link.click();
  }, "image/png");
};

export default () => {
  return <Button onClick={() => takeScreenshot()}>Screenshot</Button>;
};
