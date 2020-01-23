import React, { useRef, Suspense } from "react";
import styled from "styled-components";
import { Canvas } from "react-three-fiber";
import { useControl } from "react-three-gui";

import BoundaryCube from "./BoundaryCube";
import FPBVolume from "./FPBVolume";
import TestControls from "./TestControls";

import {VRButton} from "three/examples/jsm/webxr/VRButton";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export default ({ metadata }) => {
  if (metadata === null) {
    return null;
  }

  const xyQuality = useControl("Quality", {
    type: "number",
    value: 0.3,
    min: 0.1,
    max: 1.1
  });
  const pixelRatio = xyQuality;

  const canvasContainerRef = useRef(null);

  return (
    <CanvasContainer ref={canvasContainerRef}>
      <Canvas
        pixelRatio={pixelRatio}
        camera={{ position: [0, 0, -3] }}
        gl={{ alpha: false }}
        gl2
        vr={('xr' in navigator)}
        onCreated={({ gl }) => ('xr' in navigator) && document.body.appendChild(VRButton.createButton())}
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
  );
};
