import React, {useCallback, useEffect} from 'react';
import {useThree} from 'react-three-fiber';
import {Vector3} from 'three';

export const useRotationControls = (objectToRotate) => {
  const {camera} = useThree();

  const handlePointerMove = useCallback(e => {
    const {movementX, movementY} = e;

    const worldAxisX = new Vector3(0, 1, 0).applyQuaternion( camera.quaternion );
    const localAxisX = objectToRotate.worldToLocal(worldAxisX).normalize();

    const worldAxisY = new Vector3(1, 0, 0).applyQuaternion( camera.quaternion );
    const localAxisY = objectToRotate.worldToLocal(worldAxisY).normalize();

    objectToRotate.rotateOnAxis(localAxisX, 0.01 * movementX);
    objectToRotate.rotateOnAxis(localAxisY, 0.01 * movementY);
  }, [objectToRotate, camera.quaternion]);

  const handlePointerUp = useCallback(() => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      handlePointerUp();
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handlePointerDown, handlePointerUp]);
}
