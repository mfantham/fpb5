import React from "react";
import styled from "styled-components";
import Button from "./Button";

const takeScreenshot = () => {
  console.log("take a picture");
};

export default () => {
  return <Button onClick={() => takeScreenshot()}>Screenshot</Button>;
};
