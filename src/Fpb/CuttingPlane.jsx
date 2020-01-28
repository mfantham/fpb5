import React, { useEffect, useState } from "react";
import { useControl } from "./react-three-gui-fork";

import { Vector3, Matrix3, Plane } from "three";

export default ({ callback }) => {
  const delay = 2000;
  let timeout;
  const [showing, setShowing] = useState(false);
  const [plane, setPlane] = useState(new Plane());

  const [{ enabled, x, y, z }] = useControl("Clipping plane", {
    type: "clipping",
    value: { enabled: false, x: 0, y: 0, z: 0 },
    distance: Math.PI,
    scrub: true,
    min: { z: -1 },
    max: { z: 1 }
  });

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setShowing(true);
    timeout = setTimeout(() => setShowing(false), delay);

    const c1 = Math.cos(y);
    const s1 = Math.sin(y);
    const s2 = Math.sin(-x);
    const c2 = Math.cos(-x);

    const mX = new Matrix3().set(1, 0, 0, 0, c1, s1, 0, -s1, c1);
    const mY = new Matrix3().set(c2, 0, -s2, 0, 1, 0, s2, 0, c2);

    const normal = new Vector3(0, 0, 1).applyMatrix3(mX).applyMatrix3(mY);

    const p = new Plane(normal, -z / 2);
    setPlane(p);
    p.active = enabled;
    callback(p);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [x, y, z, enabled]);

  return (
    <object3D>
      {enabled && showing && (
        <planeHelper plane={plane} args={[plane, 1.5, "#777777"]} />
      )}
    </object3D>
  );
};
