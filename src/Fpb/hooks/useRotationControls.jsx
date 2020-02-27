import React, {useCallback, useEffect, useRef} from 'react';
import {useThree} from 'react-three-fiber';
import {Vector3} from 'three';

const OBJECT_ROTATE_SPEED = 0.01;

export const useRotationControls = (objectToRotate, domObject = window) => {
  const {camera} = useThree();

  const handlePointerMove = useCallback(e => {
    const {movementX, movementY} = e;
    const worldAxisY = new Vector3(1, 0, 0).applyQuaternion( camera.quaternion );
    const localAxisY = objectToRotate.worldToLocal(worldAxisY).normalize();

    objectToRotate.rotateOnWorldAxis(new Vector3(0, 1, 0), OBJECT_ROTATE_SPEED * movementX);
    objectToRotate.rotateOnAxis(localAxisY, OBJECT_ROTATE_SPEED * movementY);
  }, [objectToRotate, camera.quaternion]);

  const finger = useRef(null);
  const handleTouchMove = useCallback(e => {
    const {touches} = e;
    if (touches.length < 2 && finger.current && finger.current.length < 2){
      const movementX = touches[0].clientX - finger.current[0].clientX;
      const movementY = touches[0].clientY - finger.current[0].clientY;

      const worldAxisY = new Vector3(1, 0, 0).applyQuaternion( camera.quaternion );
      const localAxisY = objectToRotate.worldToLocal(worldAxisY).normalize();

      objectToRotate.rotateOnWorldAxis(new Vector3(0, 1, 0), OBJECT_ROTATE_SPEED * movementX);
      objectToRotate.rotateOnAxis(localAxisY, OBJECT_ROTATE_SPEED * movementY);
    };
    finger.current = touches;
  })

  const handlePointerUp = useCallback(() => {
    domObject.removeEventListener("pointermove", handlePointerMove);
    domObject.removeEventListener("pointerup", handlePointerUp);
    domObject.removeEventListener("touchmove", handleTouchMove);
    finger.current = null;
  }, [handlePointerMove, handleTouchMove, domObject]);

  const handlePointerDown = useCallback(e => {
    if (e.pointerType !== "touch"){
      domObject.addEventListener("pointermove", handlePointerMove);
    } else {
      domObject.addEventListener("touchmove", handleTouchMove);
    }
      domObject.addEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove, handlePointerUp, handleTouchMove, domObject]);

  useEffect(() => {
    domObject.addEventListener("pointerdown", handlePointerDown);
    return () => {
      handlePointerUp();
      domObject.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handlePointerDown, handlePointerUp, domObject]);
}
