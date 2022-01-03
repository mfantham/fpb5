import styled from "styled-components";

const ArrowsHolder = styled.div`
  display: inline-grid;
  grid-template: 15px 15px / 18px;
  font-size: 15px;
  vertical-align: bottom;
  margin-left: 5px;
`;

const ArrowHolder = styled.div`
  overflow: hidden;
`;

const ArrowUp = () => {
  return (
    <svg viewBox="-0.809 0 1.62 1">
      <polygon points="0 0 0.808 1 -0.808 1" fill="currentColor" />
    </svg>
  );
};

const ArrowDown = () => {
  return (
    <svg viewBox="-0.809 0 1.62 1">
      <polygon points="0 1 0.808 0 -0.808 0" fill="currentColor" />
    </svg>
  );
};

export const Arrows = ({ stepIndex, nSteps, increment, decrement }) => {
  return (
    <ArrowsHolder>
      <ArrowHolder
        style={
          stepIndex < nSteps - 1
            ? { cursor: "pointer" }
            : { color: "grey", cursor: "default" }
        }
        onClick={increment}
      >
        <ArrowUp />
      </ArrowHolder>
      <ArrowHolder
        style={
          stepIndex > 0
            ? { cursor: "pointer" }
            : { color: "grey", cursor: "default" }
        }
        onClick={decrement}
      >
        <ArrowDown />
      </ArrowHolder>
    </ArrowsHolder>
  );
};
