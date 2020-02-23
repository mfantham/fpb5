import React, { useCallback, useEffect, useRef, useState } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import {useControl} from "./react-three-gui-fork";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

extend({ PointerLockControls });

export default ({ domReference }) => {
  const ref = useRef();
  const { camera } = useThree();

  const [firstPersonMode] = useControl("First person mode", {
    type: "boolean",
    value: false,
    index: 10,
    keys: {toggle: "KeyF"}
  });

  const handleUserKeyPress = useCallback(
    e => {
      const { code } = e;
      let right = 0;
      let forward = 0;
      let up = 0;
      if (code === "KeyA"){
        right -= 1;
      }
      if (code === "KeyD"){
        right += 1;
      }
      if (code === "KeyE"){
        up += 1;
      }
      if (code === "KeyQ"){
        up -= 1;
      }
      if (code === "KeyW"){
        forward -= 1;
      }
      if (code  === "KeyS"){
        forward += 1;
      }
      const amplification = e.getModifierState("Shift")
        ? 5
        : e.getModifierState("Alt")
        ? 0.2
        : 1;
      right *= amplification * 0.1;
      up *= amplification * 0.1;
      forward *= amplification * 0.1;
      ref.current.getObject().translateX(right);
      ref.current.getObject().translateY(up);
      ref.current.getObject().translateZ(forward);
    }, []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <pointerLockControls
      ref={ref}
      isLocked={firstPersonMode}
      args={[camera, domReference.current]}
    />
  );
};
