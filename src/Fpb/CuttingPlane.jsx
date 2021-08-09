import React, { useEffect, useState, useRef } from "react";
import { useControl } from "./react-three-gui-fork";
import { useLoader } from "react-three-fiber";
import clipMaskImage from "./clipMask.png";

import {
  Vector3,
  Matrix3,
  Plane,
  Matrix4,
  Quaternion,
  TextureLoader,
} from "three";

export default ({ callback, parentQuaternion, useBookmarks }) => {
  const delay = 2000;
  let timeout;
  const [showing, setShowing] = useState(false);
  const [plane, setPlane] = useState(new Plane());
  const planeRef = useRef(null);
  const { bookmark, addToBookmark, bookmarkInCreation } = useBookmarks;
  const clipMask = useLoader(TextureLoader, clipMaskImage);

  const [{ enabled, x, y, z }, setClippingControl] = useControl(
    "Clipping plane",
    {
      type: "clipping",
      value: { enabled: false, x: 0, y: 0, z: 0 },
      distance: Math.PI,
      scrub: true,
      min: { z: -1 },
      max: { z: 1 },
      index: 4,
    }
  );

  useEffect(() => {
    if (bookmark) {
      setClippingControl(
        bookmark.clipping ?? { enabled: false, x: 0, y: 0, z: 0 }
      );
    }
  }, [bookmark]);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    setShowing(enabled);
    timeout = setTimeout(() => setShowing(false), delay);

    if (bookmarkInCreation.idx !== null) {
      const clippingInfo = { enabled, x, y, z };
      addToBookmark("clipping", clippingInfo);
    }

    const c1 = Math.cos(y);
    const s1 = Math.sin(y);
    const s2 = Math.sin(x);
    const c2 = Math.cos(x);

    const mX = new Matrix3().set(1, 0, 0, 0, c1, s1, 0, -s1, c1);
    const mY = new Matrix3().set(c2, 0, -s2, 0, 1, 0, s2, 0, c2);

    const normal = new Vector3(0, 0, 1).applyMatrix3(mX).applyMatrix3(mY);

    const p = new Plane(normal, -z / 2);
    p.active = enabled;

    if (planeRef.current && parentQuaternion) {
      // Align plane object with cutting plane
      const point = new Vector3(0, 0, 0);
      p.coplanarPoint(point);
      const normal2 = normal.clone();
      normal2.applyQuaternion(parentQuaternion);

      planeRef.current.position.x = 0;
      planeRef.current.position.y = 0;
      planeRef.current.position.z = 0;
      planeRef.current.lookAt(normal2);

      const { x, y, z } = point;
      planeRef.current.position.x = x;
      planeRef.current.position.y = y;
      planeRef.current.position.z = z;
    }

    callback(p);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [bookmarkInCreation.idx, x, y, z, enabled]);

  return (
    <group ref={planeRef}>
      <mesh>
        <planeBufferGeometry args={[1, 1]} attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={clipMask}
          color="white"
          transparent={true}
          opacity={showing ? 0.7 : 0}
        />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]}>
        <planeBufferGeometry args={[1, 1]} attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={clipMask}
          color="#aaaaaa"
          transparent={true}
          opacity={showing ? 0.7 : 0}
        />
      </mesh>
    </group>
  );
};
