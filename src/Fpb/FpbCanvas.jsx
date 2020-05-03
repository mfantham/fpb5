import React, { useEffect, useRef, Suspense } from "react";
import styled from "styled-components";
import { VRButton } from "three/examples/jsm/webxr/VRButton";
import { Canvas, useThree } from "react-three-fiber";

import BoundaryCube from "./BoundaryCube";
import FPBVolume from "./FPBVolume";
import FPControls from "./FPControls";
import { useQuality } from "./hooks/useQuality";

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  touch-action: none;
  z-index: 0;
`;

export default ({ metadata, useBookmarks }) => {
  if (metadata === null) {
    return null;
  }

  const [xyQuality, zQuality] = useQuality();

  const canvasContainerRef = useRef(null);
  useEffect(() => {
    canvasContainerRef.current.focus();
  }, []);

  const setupXR = ({ gl }) => {
    if ("xr" in navigator || "vr" in navigator) {
      if ("xr" in navigator) {
        gl.domElement.getContext("webgl2").makeXRCompatible();
      }
      document.body.appendChild(VRButton.createButton(gl));
    }
  };
  // const shiftForVr = [0, 1.6, -3];
  const shiftForVr = [0, 0, 0];

  return (
    <CanvasContainer ref={canvasContainerRef}>
      <Canvas
        pixelRatio={xyQuality}
        camera={{ position: [0, 1.6, 3] }}
        gl={{ alpha: false, preserveDrawingBuffer: true }}
        gl2
        vr={"xr" in navigator || "vr" in navigator}
        onCreated={setupXR}
      >
        <ambientLight />
        <FPControls domObject={canvasContainerRef.current} />
        <group position={shiftForVr}>
          <Suspense fallback={<mesh />}>
            <BoundaryCube />
          </Suspense>
          <Suspense fallback={<mesh />}>
            <FPBVolume
              metadata={metadata}
              qualityZ={zQuality}
              domObject={canvasContainerRef.current}
            />
          </Suspense>
        </group>
      </Canvas>
    </CanvasContainer>
  );
};
