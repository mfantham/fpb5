import React, { useRef } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import { OrbitControls } from "./three-full-shaken/OrbitControls";

extend({ OrbitControls });

export default ({ target, domReference }) => {
  const ref = useRef();
  const { camera } = useThree();
  useFrame(() => ref.current.update());
  return (
    <orbitControls
      ref={ref}
      screenSpacePanning={true}
      maxDistance={15}
      minDistance={0.1}
      target={target}
      args={[camera, domReference.current]}
    />
  );
};
