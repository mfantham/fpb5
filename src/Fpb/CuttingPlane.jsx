import React, { useEffect, useState } from "react";
import { useControl } from "react-three-gui";

import { Vector3, Matrix3, Plane } from "three";

export default ({ callback }) => {
  const planeActive = useControl("Clipping plane on", {
    type: "boolean",
    value: false
  });

  const rotation = useControl("Clipping plane", {
    type: "xypad",
    value: { x: 0, y: 0 },
    distance: Math.PI,
    scrub: true
  });

  const d = useControl("Clipping offset", {
    type: "number",
    value: 0,
    min: -0.5,
    max: 0.5
  });

  const delay = 2000;
  let timeout;
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setShowing(true);
    timeout = setTimeout(() => setShowing(false), delay);

    const c1 = Math.cos(rotation.y);
    const s1 = Math.sin(rotation.y);
    const s2 = Math.sin(-rotation.x);
    const c2 = Math.cos(-rotation.x);

    const mX = new Matrix3().set(1, 0, 0, 0, c1, s1, 0, -s1, c1);
    const mY = new Matrix3().set(c2, 0, -s2, 0, 1, 0, s2, 0, c2);

    const normal = new Vector3(0, 0, 1).applyMatrix3(mX).applyMatrix3(mY);

    const p = new Plane(normal, -d);
    setPlane(p);
    p.active = planeActive;
    callback(p);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [rotation.x, rotation.y, d, planeActive]);

  const [plane, setPlane] = useState(new Plane());

  return (
    <object3D>
      {showing && <planeHelper plane={plane} args={[plane, 1.5, "#777777"]} />}
    </object3D>
  );
};
