import { useState } from "react";
import styled from "styled-components";
import { ControlItem } from "./ControlItem";

const Heading = styled.h2`
  display: block;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
  padding-left: 16px;
  cursor: pointer;
  position: relative;
  user-select: none;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 8px;
    right: 16px;
    width: 12px;
    height: 2px;
    background-color: #333;
    /* transition: transform 0.25s ease-out; */
  }
  &:before {
    transform: rotate(${(props) => (props.open ? 0 : 90)}deg);
  }

  &:after {
    transform: rotate(${(props) => (props.open ? 0 : 180)}deg);
  }
`;

const Container = styled.div`
  padding: 16px;
  display: ${(props) => (props.open ? "block" : "none")};
  max-height: calc(100vh - 190px);
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ControlGroup = ({ title, controls }) => {
  const [open, setOpen] = useState(true);
  const isDefault = title !== "DEFAULT_GROUP";
  controls.sort((a, b) => {
    if (a[1].config.index === undefined || b[1].config.index === undefined) {
      return 0;
    }
    return a[1].config.index - b[1].config.index;
  });

  return (
    <div>
      {isDefault && (
        <Heading open={open} onClick={() => setOpen((o) => !o)}>
          {title}
        </Heading>
      )}
      <Container open={open}>
        {Array.from(controls).map(([id, control]) => (
          <ControlItem key={id.current} control={control} />
        ))}
      </Container>
    </div>
  );
};
