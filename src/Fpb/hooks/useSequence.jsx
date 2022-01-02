import { useState } from "react";
import TWEEN from "@tweenjs/tween.js";
import { Quaternion, Euler } from "three";

const calculateSmoothRotation = (from, to, t) => {
  // Urgh, rotations are ugly
  const cameraStartQ = new Quaternion().setFromEuler(
    new Euler(from.camerarotationx, from.camerarotationy, from.camerarotationz)
  );
  const cameraEndQ = new Quaternion().setFromEuler(
    new Euler(to.camerarotationx, to.camerarotationy, to.camerarotationz)
  );

  const dataStartQ = new Quaternion().setFromEuler(
    new Euler(from.datarotationx, from.datarotationy, from.datarotationz)
  );
  const dataEndQ = new Quaternion().setFromEuler(
    new Euler(to.datarotationx, to.datarotationy, to.datarotationz)
  );
  const cameraCurrentQ = new Quaternion();
  Quaternion.slerp(cameraStartQ, cameraEndQ, cameraCurrentQ, t);
  const dataCurrentQ = new Quaternion();
  Quaternion.slerp(dataStartQ, dataEndQ, dataCurrentQ, t);
  const cameraCurrentE = new Euler().setFromQuaternion(cameraCurrentQ);
  const dataCurrentE = new Euler().setFromQuaternion(dataCurrentQ);
  return {
    camerarotationx: cameraCurrentE.x,
    camerarotationy: cameraCurrentE.y,
    camerarotationz: cameraCurrentE.z,
    datarotationx: dataCurrentE.x,
    datarotationy: dataCurrentE.y,
    datarotationz: dataCurrentE.z,
  };
};

const toShallowObject = (deepObject) => {
  return {
    idx: deepObject.idx,
    camerapositionx: deepObject.camera.position.x,
    camerapositiony: deepObject.camera.position.y,
    camerapositionz: deepObject.camera.position.z,
    camerarotationx: deepObject.camera.rotation.x,
    camerarotationy: deepObject.camera.rotation.y,
    camerarotationz: deepObject.camera.rotation.z,
    clippingenabled: deepObject.clipping.enabled,
    clippingx: deepObject.clipping.x,
    clippingy: deepObject.clipping.y,
    clippingz: deepObject.clipping.z,
    datarotationx: deepObject.data.rotation.x,
    datarotationy: deepObject.data.rotation.y,
    datarotationz: deepObject.data.rotation.z,
    datarenderingprojection: deepObject.data.rendering.projection,
    datarenderingopacity: deepObject.data.rendering.opacity,
    datarenderingintensity: deepObject.data.rendering.intensity,
    datarenderingthreshold: deepObject.data.rendering.threshold,
  };
};

const toDeepObject = (shallowObject) => {
  return {
    idx: shallowObject.idx,
    camera: {
      position: {
        x: shallowObject.camerapositionx,
        y: shallowObject.camerapositiony,
        z: shallowObject.camerapositionz,
      },
      rotation: {
        x: shallowObject.camerarotationx,
        y: shallowObject.camerarotationy,
        z: shallowObject.camerarotationz,
      },
    },
    clipping: {
      enabled: shallowObject.clippingenabled,
      x: shallowObject.clippingx,
      y: shallowObject.clippingy,
      z: shallowObject.clippingz,
    },
    data: {
      rotation: {
        x: shallowObject.datarotationx,
        y: shallowObject.datarotationy,
        z: shallowObject.datarotationz,
      },
      rendering: {
        projection: shallowObject.datarenderingprojection,
        opacity: shallowObject.datarenderingopacity,
        intensity: shallowObject.datarenderingintensity,
        threshold: shallowObject.datarenderingthreshold,
      },
    },
  };
};

export const useSequence = () => {
  const [arrayOfSequences, setArrayOfSequences] = useState([]);
  const [editingSequence, setEditingSequence] = useState(null);

  const [stepInCreation, setStepInCreation] = useState({ idx: null });

  const [playbackState, setPlaybackState] = useState({
    hash: null,
    sequenceIdx: null,
    stepIdx: null,
  });

  const addStep = () => {
    const newStep = { idx: arrayOfSequences[editingSequence].sequence.length };
    setStepInCreation(newStep);
  };

  const addToStep = (key, value) => {
    const updatedStep = stepInCreation;
    updatedStep[key] = value;
    setStepInCreation(updatedStep);
    saveStep();
  };

  const saveStep = () => {
    const readyForSave = ["camera", "clipping", "data"].every(
      (v) => !!stepInCreation?.[v]
    );
    if (readyForSave) {
      const stepIndex =
        stepInCreation.idx ?? arrayOfSequences[editingSequence].sequence.length;
      arrayOfSequences[editingSequence].sequence[stepIndex] = toShallowObject(
        stepInCreation
      );
      setStepInCreation({ idx: null });
    }
  };

  const newSequence = () => {
    const newArrayOfSequences = [...arrayOfSequences];
    const newIdx = newArrayOfSequences.length;
    newArrayOfSequences.push({ idx: newIdx, sequence: [] });
    setArrayOfSequences(newArrayOfSequences);
    setEditingSequence(newIdx);
  };

  const playSequence = (idx) => {
    // do something
    const duration = 2000; // should come from sequence 0 (or 1??)
    const mutatedState = { ...arrayOfSequences[idx].sequence[0] };

    const initialTween = new TWEEN.Tween(mutatedState).to(
      arrayOfSequences[idx].sequence[0],
      0
    );

    const nSteps = arrayOfSequences[idx].sequence.length;
    let tweens = [initialTween];
    for (let n = 1; n < nSteps; n++) {
      const step = arrayOfSequences[idx].sequence[n];
      const stepTween = new TWEEN.Tween(mutatedState)
        .to(step, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          const progress = mutatedState.idx === n ? 1 : mutatedState.idx % 1;
          const smoothRotations = calculateSmoothRotation(
            arrayOfSequences[idx].sequence[n - 1],
            step,
            progress
          );
          const newShallowState = { ...mutatedState, ...smoothRotations };
          const hash = JSON.stringify(newShallowState);
          const deepState = toDeepObject(newShallowState);
          const newPlaybackState = {
            hash,
            sequenceIdx: idx,
            stepIdx: n,
            ...deepState,
          };
          setPlaybackState(newPlaybackState);
        });
      tweens[n - 1].chain(stepTween);
      tweens[n] = stepTween;
    }

    tweens[0].start();
  };

  const stopSequence = () => {
    setPlaybackState({ hash: null, sequenceIdx: null, stepIdx: null });
    TWEEN.removeAll();
  };

  return {
    arrayOfSequences,
    editingSequence,
    setEditingSequence,
    addStep,
    addToStep,
    newSequence,
    playSequence,
    stopSequence,
    playbackState,
    stepInCreation,
  };
};
