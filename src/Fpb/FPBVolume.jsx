import React, { useEffect, useRef, useState } from "react";

import { DataTexture3D, Plane, Vector3 } from "three";

import CuttingPlane from "./CuttingPlane";
import FpbMaterial from "./FpbMaterial";
import { useRendering } from "./hooks/useRendering";
import {useRotationControls} from "./hooks/useRotationControls";

const PROJECTIONS = [
  "Transparency",
  "Max. projection",
  "Max. RGB average",
  "Iso-surface"
];

const calculateScale = (voxelSize, res, size) => {
  const { x, y, z } = voxelSize;
  const rawScale = [x * res[0], y * res[1], z * res[2]];
  const maxScale = Math.max(...rawScale);
  const scale = rawScale.map(v => (v * size) / maxScale);
  return scale;
};

export default ({ metadata, qualityZ }) => {
  if (metadata === null) {
    return null;
  }

  const objectRef = useRef(null);

  const [clippingPlane, setClippingPlane] = useState(
    new Plane(new Vector3(0, 0, 0), 0)
  );

  const {
    images,
    voxelSize,
    sliceWidth,
    sliceHeight,
    numberOfImages
  } = metadata;

  const texture3d = new DataTexture3D(
    images,
    sliceWidth,
    sliceHeight,
    numberOfImages
  );

  const dataResolution = [sliceWidth, sliceHeight, numberOfImages];
  const {projection, opacity, intensity, threshold, size} = useRendering(metadata, PROJECTIONS);

  const scale = calculateScale(voxelSize, dataResolution, size.value);

  useEffect(() => {
    opacity.setVisible(projection.value === PROJECTIONS[0]); // This doesn't actually work yet!
    // opacity.set(projection.value === PROJECTIONS[0] ? 0.1 : 5.7); // This works, but is useful for bookmarking - ie not here!
  }, [projection.value]);

  useRotationControls(objectRef.current);

  return (
    <object3D ref={objectRef} scale={scale} renderOrder={2}>
      <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1]} />
        <FpbMaterial
          texture3d={texture3d}
          steps={512 * qualityZ}
          projection={PROJECTIONS.indexOf(projection.value)}
          opacity={opacity.value}
          intensity={intensity.value}
          threshold={threshold.value}
          clippingPlane={clippingPlane}
        />
      </mesh>
      <CuttingPlane callback={matrix => setClippingPlane(matrix)} />
    </object3D>
  );
};
