import React from "react";

import {DoubleSide} from "three";



export default ({plane}) => {


  return (
    <mesh position={[0, 0, -2 * plane[2]]} rotation={[-plane[0], plane[1], 0]} renderOrder={1}>
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <meshStandardMaterial attach="material" color='#777777' side={DoubleSide} transparent opacity={0.5} />
    </mesh>
  );
}
