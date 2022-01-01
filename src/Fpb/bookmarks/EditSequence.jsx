import { AnnotationDiv, CloseButton } from "../ui/AnnotationDiv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "../leftMenu/Button";

export const EditSequence = ({ useSequence }) => {
  const {
    editingSequence,
    setEditingSequence,
    addStep,
    arrayOfSequences,
  } = useSequence;

  const open = editingSequence !== null;

  return (
    <>
      <AnnotationDiv open={open}>
        Editing sequence {editingSequence}:{" "}
        {arrayOfSequences?.[editingSequence]?.sequence?.length} steps
        <br />
        <Button onClick={addStep} style={{ width: 100 }}>
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
