import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AnnotationDiv, CloseButton } from "../ui/AnnotationDiv";
import Button from "../leftMenu/Button";
import { Arrows } from "../common/Arrows";

export const EditSequence = ({ useSequence }) => {
  const {
    editingSequence,
    setEditingSequence,
    addStep,
    arrayOfSequences,
    viewStep,
  } = useSequence;

  const open = editingSequence !== null;
  const [stepIndex, setStepIndex] = useState(-1);

  const nSteps = arrayOfSequences?.[editingSequence]?.sequence?.length;

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
