import React, { useState } from "react";

import { DataTexture3D, Plane, Vector3 } from "three";
import { useControl } from "react-three-gui";

import CuttingPlane from "./CuttingPlane";
import FpbMaterial from "./FpbMaterial";

const calculateScale = (voxelSize, res, size) => {
  const { x, y, z } = voxelSize;
  const rawScale = [x * res[0], y * res[1], z * res[2]];
  const maxScale = Math.max(...rawScale);
  const scale = rawScale.map(v => (v * size) / maxScale);
  return scale;
};

const projections = [
  "Transparency",
  "Max. projection",
  "Max. RGB average",
  "Iso-surface"
];

export default ({ metadata, qualityZ }) => {
  if (metadata === null) {
    return null;
  }

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
  const projection = useControl("Projection", {
    type: "select",
    items: projections,
    value: projections[metadata.projection],
  });
  const opacity = useControl("Opacity", {
    type: "number",
    value: metadata.opacity / 8,
    min: 0,
    max: 1
  });
  const intensity = useControl("Intensity", {
    type: "number",
    value: metadata.intensity,
    min: 0,
    max: 5.0
  });
  const threshold = useControl("Cutoff", {
    type: "number",
    value: metadata.threshold,
    min: 0,
    max: 1.0
  });
  const size = useControl("Size", {
    type: "number",
    value: 3.5,
    min: 0.1,
    max: 5
  });
  const scale = calculateScale(voxelSize, dataResolution, size);

  return (
    <object3D scale={scale} renderOrder={2}>
      <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1]} />
        <FpbMaterial
          texture3d={texture3d}
          steps={512 * qualityZ}
          projection={projections.indexOf(projection)}
          opacity={opacity}
          intensity={intensity}
          threshold={threshold}
          clippingPlane={clippingPlane}
        />
      </mesh>
      <CuttingPlane callback={matrix => setClippingPlane(matrix)} />
    </object3D>
  );
};
