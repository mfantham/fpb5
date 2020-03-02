import React, { useCallback, useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useThree } from "react-three-fiber";
import { useControl } from "./react-three-gui-fork";

const CAMERA_ROTATE_SPEED = -0.003;
const SCROLL_ZOOM_SPEED = 0.1;
const TOUCH_SPEED = -0.01;
const PAN_SPEED = 0.005; // could multiply speed by distance from origin...

export default ({ domObject }) => {
  const { camera } = useThree();

  const [firstPersonMode] = useControl("First person mode", {
    type: "boolean",
    value: false,
    index: 10,
    keys: { toggle: "KeyF" }
  });

  const handlePointerMove = useCallback(
    e => {
      const { movementX, movementY, buttons } = e;
      if (firstPersonMode && buttons === 0) {
        camera.rotateOnWorldAxis(
          new Vector3(0, 1, 0),
          CAMERA_ROTATE_SPEED * movementX
        );
        if (
          (camera.rotation.x < 1.5 && camera.rotation.x > -1.5) ||
          (camera.rotation.x > 1.5 && movementY > 0) ||
          (camera.rotation.x < -1.5 && movementY < 0)
        ) {
          camera.rotateOnAxis(
            new Vector3(1, 0, 0),
            CAMERA_ROTATE_SPEED * movementY
          );
        }
      } else if (buttons === 2) {
        e.preventDefault();
        camera.translateX(-PAN_SPEED * movementX);
        camera.translateY(PAN_SPEED * movementY);
      }
    },
    [firstPersonMode]
  );

  const fingers = useRef(null);

  const handleDoubleTouchMove = e => {
    const { touches } = e;
    if (fingers.current) {
      const o0 = fingers.current[0];
      const o1 = fingers.current[1];
      const n0 = touches[0];
      const n1 = touches[1];

      const oldAmplitude = Math.hypot(
        o0.clientX - o1.clientX,
        o0.clientY - o1.clientY
      );
      const newAmplitude = Math.hypot(
        n0.clientX - n1.clientX,
        n0.clientY - n1.clientY
      );
      const deltaAmplitude = newAmplitude - oldAmplitude;

      const movementX = (n0.clientX + n1.clientX - o0.clientX - o1.clientX) / 2;
      const movementY = (n0.clientY + n1.clientY - o0.clientY - o1.clientY) / 2;

      camera.translateZ(TOUCH_SPEED * deltaAmplitude);
      camera.translateX(TOUCH_SPEED * movementX);
      camera.translateY(-TOUCH_SPEED * movementY);
    }
    fingers.current = touches;
  };

  const handleTouchStart = e => {
    e.preventDefault();
    if (e.touches.length === 2) {
      window.addEventListener("touchmove", handleDoubleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }
  };

  const handleTouchEnd = () => {
    window.removeEventListener("touchmove", handleDoubleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
    fingers.current = null;
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [firstPersonMode]);

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const handleScroll = useCallback(e => {
    const forward = e.deltaY > 0 ? 1 : -1;
    camera.translateZ(SCROLL_ZOOM_SPEED * forward);
  }, []);

  const handleUserKeyPress = useCallback(e => {
    const { code } = e;
    let right = 0;
    let forward = 0;
    let up = 0;
    if (code === "KeyA") {
      right -= 1;
    }
    if (code === "KeyD") {
      right += 1;
    }
    if (code === "KeyQ") {
      up -= 1;
    }
    if (code === "KeyE") {
      up += 1;
    }
    if (code === "KeyW") {
      forward -= 1;
    }
    if (code === "KeyS") {
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
  }, []);

  const handleContextMenu = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress, true);
    domObject.addEventListener("wheel", handleScroll);
    domObject.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
      domObject.removeEventListener("wheel", handleScroll);
      domObject.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleUserKeyPress]);

  return null;
};
