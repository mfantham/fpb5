import React from "react";
import styled, { keyframes } from "styled-components";

import logo from "./logo-1000.png";

const rotate = keyframes`
  from {transform: rotateX(0deg) rotateY(0deg);}
  to {transform: rotateX(1080deg) rotateY(360deg);}
`;

const CubeHolder = styled.div`
  width: 200px;
  height: 200px;
  perspective: 600px;
`;

const Cube = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translateZ(-100px);
  animation: ${rotate} 20s linear infinite;
`;

const CubeFace = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border: solid black 5px;
  background: url("${logo}") 0 0/100% 100%;
`;

const Front = styled(CubeFace)`
  transform: rotateY(0deg) translateZ(100px);
`;
const Back = styled(CubeFace)`
  transform: rotateY(180deg) translateZ(100px);
`;
const Left = styled(CubeFace)`
  transform: rotateY(-90deg) translateZ(100px);
`;
const Right = styled(CubeFace)`
  transform: rotateY(90deg) translateZ(100px);
`;
const Top = styled(CubeFace)`
  transform: rotateX(90deg) translateZ(100px);
`;
const Bottom = styled(CubeFace)`
  transform: rotateX(-90deg) translateZ(100px);
`;

export default () => {
  return (
    <CubeHolder>
      <Cube>
        <Front />
        <Back />
        <Left />
        <Right />
        <Top />
        <Bottom />
      </Cube>
    </CubeHolder>
  );
};
