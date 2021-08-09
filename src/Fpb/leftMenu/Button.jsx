import React from "react";
import styled from "styled-components";

const ButtonStyled = styled.button`
  display: block;
  position: relative;
  flex-grow: ${(p) => (p.circular ? "0" : "1")};

  font-family: sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);

  height: 32px;
  ${(p) => (p.circular ? "width: 32px" : "")};

  border: 0;
  background-color: rgba(255, 255, 255, 0.1);

  border-radius: 16px;

  :disabled {
    color: rgba(128, 128, 128, 0.75);
  }
`;

const Button = ({ onClick, children, ...props }) => {
  return (
    <ButtonStyled onClick={onClick} {...props}>
      {children}
    </ButtonStyled>
  );
};

export const ButtonHolder = styled.div`
  margin: 8px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 32px;
  grid-gap: 8px;
`;

export default Button;
