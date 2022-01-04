import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AnnotationDiv, CloseButton } from "../ui/AnnotationDiv";
import Button from "../leftMenu/Button";
import { Arrows } from "../common/Arrows";
import { Option, Select } from "../react-three-gui-fork/controls/SelectControl";

import { TRANSITION_OPTIONS } from "../hooks/useSequence";

export const EditSequence = ({ useSequence }) => {
  const {
    editingSequence,
    setEditingSequence,
    addStep,
    updateStep,
    arrayOfSequences,
    viewStep,
  } = useSequence;

  const open = editingSequence !== null;
  const [stepIndex, setStepIndex] = useState(-1);
  const [refresh, setRefresh] = useState(0);

  const nSteps = arrayOfSequences?.[editingSequence]?.sequence?.length;
  const transition =
    arrayOfSequences?.[editingSequence]?.sequence?.[stepIndex]?.transition ??
    "linear";
  const stepDuration =
    arrayOfSequences?.[editingSequence]?.sequence?.[stepIndex]?.duration ?? 2;

  const decrement = (e) => {
    e.preventDefault();
    if (stepIndex > 0) {
      viewStep(stepIndex - 1);
      setStepIndex(stepIndex - 1);
    }
  };

  const increment = (e) => {
    e.preventDefault();
    if (stepIndex < nSteps - 1) {
      viewStep(stepIndex + 1);
      setStepIndex(stepIndex + 1);
    }
  };

  const handleAddKeyframe = () => {
    addStep(stepIndex + 1);
    setStepIndex(stepIndex + 1);
  };

  const handleStepUpdate = useCallback(
    (key, value) => {
      updateStep(key, value, editingSequence, stepIndex);
      setRefresh((s) => s + 1);
    },
    [editingSequence, stepIndex]
  );

  return (
    <>
      <AnnotationDiv open={open}>
        <span>
          Editing sequence {editingSequence}: Step{" "}
          {stepIndex !== -1 ? (
            <>
              {stepIndex + 1}
              <Arrows
                stepIndex={stepIndex}
                nSteps={nSteps}
                increment={increment}
                decrement={decrement}
              />
            </>
          ) : (
            "-"
          )}{" "}
          of {nSteps}
        </span>
        {nSteps > 1 ? (
          <span>
            transition {stepIndex} → {stepIndex + 1}:{" "}
            <Select
              value={transition}
              style={{ display: "inline-block", width: 100 }}
              onChange={(e) =>
                handleStepUpdate("transition", e.currentTarget.value)
              }
            >
              {TRANSITION_OPTIONS.map((item, i) => (
                <Option key={i} {...item} />
              ))}
            </Select>
            <input
              type="number"
              value={stepDuration}
              style={{ width: 30 }}
              onChange={(e) => handleStepUpdate("duration", e.target.value)}
            />
            seconds
          </span>
        ) : nSteps === 1 ? (
          <i>Add another keyframe to transition</i>
        ) : (
          <i>Add a keyframe to begin</i>
        )}
        <Button onClick={handleAddKeyframe} style={{ width: 100 }}>
          Add keyframe
        </Button>
      </AnnotationDiv>
      <CloseButton
        onClick={() => setEditingSequence(null)}
        open={open}
        title={`Finish editing sequence ${editingSequence}`}
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </CloseButton>
    </>
  );
};
