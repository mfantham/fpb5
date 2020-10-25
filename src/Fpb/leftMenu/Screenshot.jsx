import React from "react";
import { useThree } from "react-three-fiber";
import Button from "./Button";

const takeScreenshot = () => {
  const canvas = document.getElementsByTagName("canvas")[0]; // very unreactful :( useThree() ? nop. not in canvas. move to canvas?
  const link = document.createElement("a");
  link.download = "screenshot.png";

  canvas.toBlob(blob => {
    link.href = URL.createObjectURL(blob);
    link.click();
  }, "image/png");
};

export default () => {
  return <Button onClick={() => takeScreenshot()} style={{width: "50%", marginRight: "4px"}}>Screenshot</Button>;
};
