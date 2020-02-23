import React, {useCallback, useEffect} from 'react';
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

  const handlePointerUp = useCallback(() => {
    domObject.removeEventListener("pointermove", handlePointerMove);
    domObject.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove, domObject]);

  const handlePointerDown = useCallback(() => {
    domObject.addEventListener("pointermove", handlePointerMove);
    domObject.addEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove, handlePointerUp, domObject]);

  useEffect(() => {
    domObject.addEventListener("pointerdown", handlePointerDown);
    return () => {
      handlePointerUp();
      domObject.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handlePointerDown, handlePointerUp, domObject]);
}
