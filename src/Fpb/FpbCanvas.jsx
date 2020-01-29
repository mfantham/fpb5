import React, { useRef, Suspense } from "react";
import styled from "styled-components";
import { Canvas } from "react-three-fiber";
import { useControl } from "./react-three-gui-fork";

import BoundaryCube from "./BoundaryCube";
import FPBVolume from "./FPBVolume";
import TestControls from "./TestControls";

import { VRButton } from "three/examples/jsm/webxr/VRButton";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 0;
`;

export default ({ metadata }) => {
  if (metadata === null) {
    return null;
  }

  const [xyQuality] = useControl("Quality-XY", {
    type: "number",
    value: 0.4,
    min: 0.1,
    max: 1.1
  });
  const [qualityZ] = useControl("Quality-Z", {
    type: "number",
    value: 0.7,
    min: 0.1,
    max: 1.5
  });
  const pixelRatio = xyQuality;

  const canvasContainerRef = useRef(null);

  const setupXR = obj => {
    const { gl } = obj;
    console.log(obj);
    if ("xr" in navigator || "vr" in navigator) {
      if ("xr" in navigator) {
        gl.domElement.getContext("webgl2").makeXRCompatible();
      }
      document.body.appendChild(VRButton.createButton(gl));
    }
  };

  return (
    <CanvasContainer ref={canvasContainerRef}>
      <Canvas
        pixelRatio={pixelRatio}
        camera={{ position: [0, 0, -3] }}
        gl={{ alpha: false }}
        gl2
        vr={"xr" in navigator || "vr" in navigator}
        onCreated={setupXR}
      >
        <ambientLight />
        <TestControls domReference={canvasContainerRef} />
        <Suspense fallback={<mesh />}>
          <BoundaryCube />
        </Suspense>
        <Suspense fallback={<mesh />}>
          <FPBVolume metadata={metadata} qualityZ={qualityZ} />
        </Suspense>
      </Canvas>
    </CanvasContainer>
  );
};
