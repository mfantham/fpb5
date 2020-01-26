import React, {useEffect, useState, useRef} from "react";
import {useControl} from "react-three-gui";
import {useFrame} from "react-three-fiber";
import {DoubleSide} from "three";

import {Euler, Vector3, Matrix3, Plane} from "three";

export default ({callback}) => {
  // Control of the plane is still poor.
  // But alignment with the graphics card is bon.

  const ref = useRef();

  const d = useControl("Offset", {
    type: "number",
    value: 0,
    min: -0.5,
    max: 0.5
  });

  const r1 = useControl("rX", {
    type: "number",
    value: 0,
    min: -Math.PI,
    max: Math.PI,
  });

  const r2 = useControl("rY", {
    type: "number",
    value: 0,
    min: -Math.PI,
    max: Math.PI,
  });

  useEffect(() => {
    const mX = new Matrix3().set(1, 0, 0, 0, Math.cos(r1), Math.sin(r1), 0, -Math.sin(r1), Math.cos(r1));
    const mY = new Matrix3().set(Math.cos(r2), 0, -Math.sin(r2), 0, 1, 0, Math.sin(r2), 0, Math.cos(r2));

    const normal = new Vector3(0, 0, 1).applyMatrix3(mX).applyMatrix3(mY); // combine these into 1

    const p = new Plane(normal, -d);
    setPlane(p);
    callback(p);
  }, [r1, r2, d]);

  const [plane, setPlane] = useState(new Plane());


  // <mesh ref={ref} rotation={[r1, r2, 0]} position={[0, 0, -d]}>
  //   <planeBufferGeometry attach="geometry" args={[1.5, 1.5]} />
  //   <meshStandardMaterial attach="material" color='#777777' side={DoubleSide} transparent opacity={0.5} />
  // </mesh>
  return (
    <object3D>
      <planeHelper plane={plane} args={[plane, 1.5, '#777777']}/>
    </object3D>
  );
}
