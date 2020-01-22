import React from "react";
import styled from "styled-components";
import Logo3D from "./Logo3D";
import Loader from "./Fpb/Loader";

const LoadingHolder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  color: whtie;
  pointer-events: none;
`;

export default ({ datasetUrl, setMetadataCallback }) => {
  return (
    <LoadingHolder>
      <Logo3D />
      <Loader
        setMetadataCallback={setMetadataCallback}
        datasetUrl={datasetUrl}
      />
    </LoadingHolder>
  );
};
