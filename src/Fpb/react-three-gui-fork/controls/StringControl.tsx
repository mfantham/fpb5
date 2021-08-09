import React from "react";
import styled from "styled-components";
import { BaseControl } from "./BaseControl";

const Input = styled.input`
  display: block;

  font-family: sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);

  display: block;
  position: relative;

  width: 100%;
  height: 32px;

  margin-left: 8px;

  border: 0;
  background-color: rgba(0, 0, 0, 0.025);
  border-radius: 4px;
  padding: 0 4px;
`;

export const StringControl = React.memo(({ control, value }: any) => {
  return (
    <BaseControl label={control.name}>
      <Input value={value} onChange={(e) => control.set(e.target.value)} />
    </BaseControl>
  );
});
