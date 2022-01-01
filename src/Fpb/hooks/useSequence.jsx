import { useState } from "react";

export const useSequence = () => {
  const [arrayOfSequences, setArrayOfSequences] = useState([]);
  const [editingSequence, setEditingSequence] = useState(null);

  const [stepInCreation, setStepInCreation] = useState({ idx: null });

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
      arrayOfSequences[editingSequence].sequence[stepIndex] = {
        ...stepInCreation,
      };
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
    console.log(arrayOfSequences[idx]);
  };

  return {
    arrayOfSequences,
    editingSequence,
    setEditingSequence,
    addStep,
    addToStep,
    newSequence,
    playSequence,
    stepInCreation,
  };
};
