import styled from "styled-components";

const SLIDE_TIME = 400; // ms

export const AnnotationDiv = styled.div`
  position: absolute;
  background-color: #2228;
  display: flex;
  flex-direction: column;
  padding: 16px 50px 16px 16px;
  color: white;
  backdrop-filter: blur(20px);
  border-radius: 8px;
  height: 100px;
  bottom: ${(p) => (p.open ? "65px" : "-165px")};
  width: 80vw;
  overflow: auto;
  left: 0;
  right: 0;
  margin: auto;

  transition: bottom ${SLIDE_TIME}ms ease;
`;

export const CloseButton = styled.button`
  position: absolute;
  font-size: 1.4rem;
  color: white;
  bottom: ${(p) => (p.open ? "141px" : "-96px")};
  right: calc(10vw - 24px);
  width: 48px;
  height: 48px;
  border: 0;
  background: transparent;
  border-radius: 100vh;
  backdrop-filter: blur(20px);

  :hover {
    background: rgba(255, 255, 255, 0.5);
  }

  :focus {
    outline: 0;
  }

  transition: box-shadow 0.2s ease, background 0.2s ease,
    bottom ${SLIDE_TIME}ms ease;
`;

export const AnnotationTextArea = styled.textarea`
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  padding: 10px;
  font-family: inherit;
  outline: 0;
`;
