import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import TestControls from "./TestControls";

export default props => {
  const ref = useRef();
  const { setDefaultCamera } = useThree();
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current), []);
  // Update it every frame
  useFrame(() => ref.current.updateMatrixWorld());
  return (
    <>
      <TestControls camera={ref.current} />
      <perspectiveCamera ref={ref} {...props} />
    </>
  );
};
