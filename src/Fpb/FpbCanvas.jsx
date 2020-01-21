import React, { useRef, Suspense } from "react";
import styled from "styled-components";
import { Canvas } from "react-three-fiber";
import { Controls, useControl } from "react-three-gui";

import TestCube from "./TestCube";
import BoundaryCube from "./BoundaryCube";
import FPBVolume from "./FPBVolume";
import TestControls from "./TestControls";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export default ({ metadata }) => {
  const xyQuality = useControl("Quality", {
    type: "number",
    value: 0.3,
    min: 0.1,
    max: 1.1
  });
  const pixelRatio = xyQuality;

  const canvasContainerRef = useRef(null);

  return (
    <>
      <CanvasContainer ref={canvasContainerRef}>
        <Canvas
          pixelRatio={pixelRatio}
          camera={{ position: [0, 0, -3] }}
          gl={{ alpha: false }}
          gl2
        >
          <ambientLight />
          <TestControls domReference={canvasContainerRef} />
          <Suspense fallback={<mesh />}>
            <BoundaryCube />
          </Suspense>
          <Suspense fallback={<mesh />}>
            <FPBVolume metadata={metadata} />
          </Suspense>
        </Canvas>
      </CanvasContainer>
      <Controls />
    </>
  );
};
