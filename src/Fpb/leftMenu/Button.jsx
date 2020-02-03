import React from "react";
import styled from "styled-components";

const ButtonStyled = styled.button`
  display: block;

  font-family: sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);

  display: block;
  position: relative;

  width: 100%;
  height: 32px;

  border: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0 4px;
`;

export default ({ onClick, children }) => {
  return (
    <div style={{ padding: "8px 0" }}>
      <ButtonStyled onClick={onClick}>{children}</ButtonStyled>
    </div>
  );
};
