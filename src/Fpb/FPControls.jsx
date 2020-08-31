import React, { useCallback, useEffect, useRef } from "react";
import { Vector3, Euler } from "three";
import { useThree } from "react-three-fiber";
import { useControl } from "./react-three-gui-fork";

import {
  CAMERA_ROTATE_SPEED,
  SCROLL_ZOOM_SPEED,
  TOUCH_SPEED,
  PAN_SPEED
} from "./constants";

export default ({ domObject, useBookmarks }) => {
  const { camera, invalidate } = useThree();

  const { bookmark, bookmarkInCreation, addToBookmark } = useBookmarks;

  useEffect(() => {
    if (bookmarkInCreation.idx !== null) {
      const {x, y, z} = camera.rotation;
      const value = { position: camera.position, rotation: {x, y, z} };
      addToBookmark("camera", value);
    }
  }, [bookmarkInCreation.idx, camera.rotation.x, camera.rotation.y, camera.rotation.z, camera.position.x, camera.position.y, camera.position.z]);

  useEffect(() => {
    if (bookmark && bookmark.camera) {
      const {x, y, z} = bookmark.camera.rotation;
      camera.setRotationFromEuler(new Euler(x, y, z, 'XYZ'));
      camera.position.x = bookmark.camera.position.x;
      camera.position.y = bookmark.camera.position.y;
      camera.position.z = bookmark.camera.position.z;
    }
  }, [bookmark?.idx]);

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
        invalidate();
      } else if (buttons === 2) {
        e.preventDefault();
        const d = camera.position.distanceTo(new Vector3(0, 0, 0));
        camera.translateX(-PAN_SPEED * movementX * 0.1 * d);
        camera.translateY(PAN_SPEED * movementY * 0.1 * d);
        invalidate();
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
    invalidate();
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
    invalidate();
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
  });

  useEffect(() => {
    document.addEventListener("keydown", handleUserKeyPress);
    domObject.addEventListener("wheel", handleScroll);
    domObject.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("keydown", handleUserKeyPress);
      domObject.removeEventListener("wheel", handleScroll);
      domObject.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleUserKeyPress]);

  return null;
};
