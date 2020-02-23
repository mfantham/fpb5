import React, { useCallback, useEffect } from "react";
import {Vector3} from 'three';
import { useThree } from "react-three-fiber";
import { useControl } from "./react-three-gui-fork";

const CAMERA_ROTATE_SPEED = -0.003;
const SCROLL_ZOOM_SPEED = 0.1;

export default ({ domObject }) => {
  const { camera } = useThree();

  const [firstPersonMode] = useControl("First person mode", {
    type: "boolean",
    value: false,
    index: 10,
    keys: {toggle: "KeyF"}
  });

  const handlePointerMove = useCallback(e => {
    const {movementX, movementY} = e;
    camera.rotateOnWorldAxis(new Vector3(0, 1, 0), CAMERA_ROTATE_SPEED * movementX);
    if (camera.rotation.x < 1.5 && camera.rotation.x > -1.5 || camera.rotation.x > 1.5 && movementY > 0 || camera.rotation.x < -1.5 && movementY < 0) {
      camera.rotateOnAxis(new Vector3(1, 0, 0), CAMERA_ROTATE_SPEED * movementY);
    }
  }, []);

  useEffect(() => {
    if (firstPersonMode){
      window.addEventListener('pointermove', handlePointerMove);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
    }
    return (() => {
      window.removeEventListener('pointermove', handlePointerMove);
    })
  }, [firstPersonMode]);

  const handleScroll = useCallback(
    e => {
      const forward = e.deltaY > 0 ? 1 : -1;
      camera.translateZ(SCROLL_ZOOM_SPEED * forward);
    }, []
  );

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
      if (code === "KeyQ"){
        up -= 1;
      }
      if (code === "KeyE"){
        up += 1;
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
      camera.translateX(right);
      camera.translateY(up);
      camera.translateZ(forward);
    }, []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress, true);
    domObject.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
      domObject.removeEventListener("wheel", handleScroll);
    };
  }, [handleUserKeyPress]);

  return null;
};
