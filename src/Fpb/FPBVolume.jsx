import React, { Suspense, useEffect, useRef, useState } from "react";

import { DataTexture3D, Plane, Vector3 } from "three";

import CuttingPlane from "./CuttingPlane";
import FpbMaterial from "./FpbMaterial";

import { useRotationControls } from "./hooks/useRotationControls";
import { useRendering } from "./hooks/useRendering";
import { PROJECTIONS } from "./constants";

const calculateScale = (voxelSize, res, size) => {
  const { x, y, z } = voxelSize;
  const rawScale = [x * res[0], y * res[1], z * res[2]];
  const maxScale = Math.max(...rawScale);
  const scale = rawScale.map(v => (v * size) / maxScale);
  return scale;
};

export default ({
  metadata,
  qualityZ,
  interpolateZ,
  domObject,
  useBookmarks
}) => {
  if (metadata === null) {
    return null;
  }

  const objectRef = useRef(null);

  const [clippingPlane, setClippingPlane] = useState(
    new Plane(new Vector3(0, 0, 0), 0)
  );

  const { bookmark, addToBookmark, bookmarkInCreation } = useBookmarks;
  const [setRotation] = useRotationControls(objectRef.current, domObject);
  const [rendering, setRendering] = useRendering(metadata);
  const { projection, opacity, intensity, threshold, size } = rendering;

  useEffect(() => {
    if (bookmarkInCreation.idx !== null) {
      const { x, y, z } = objectRef.current.rotation;
      const value = {
        rotation: { x, y, z },
        rendering: {
          projection: PROJECTIONS.indexOf(projection.value),
          opacity: opacity.value,
          intensity: intensity.value,
          threshold: threshold.value
        }
      };
      addToBookmark("data", value);
    }
  }, [
    bookmarkInCreation.idx,
    objectRef.current?.rotation?.x,
    objectRef.current?.rotation?.y,
    objectRef.current?.rotation?.z,
    projection.value,
    opacity.value,
    intensity.value,
    threshold.value
  ]);

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

  const scale = calculateScale(voxelSize, dataResolution, size.value);

  useEffect(() => {
    if (bookmark && bookmark.data) {
      setRendering(bookmark.data.rendering);
      setRotation(bookmark.data.rotation);
    }
  }, [bookmark]);

  useRotationControls(objectRef.current, domObject);

  return (
    <object3D ref={objectRef} scale={scale} renderOrder={2}>
      <Suspense>
        <CuttingPlane
          callback={matrix => setClippingPlane(matrix)}
          parentQuaternion={objectRef.current?.quaternion}
          useBookmarks={useBookmarks}
        />
      </Suspense>
      <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1]} />
        <FpbMaterial
          texture3d={texture3d}
          steps={512 * qualityZ}
          interpolation={interpolateZ ? numberOfImages : 0}
          projection={PROJECTIONS.indexOf(projection.value)}
          opacity={opacity.value}
          intensity={intensity.value}
          threshold={threshold.value}
          clippingPlane={clippingPlane}
        />
      </mesh>
    </object3D>
  );
};
