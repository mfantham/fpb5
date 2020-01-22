import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Controls } from 'react-three-gui';

import FpbCanvas from "./FpbCanvas";
import LoadingScreen from "../LoadingScreen";

const FPBioimageHolder = styled.div`
  width: 100%;
  height: 100%;
`;

const FPBioimageApp = ({datasetUrl}) => {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    setMetadata(null);
  }, [datasetUrl]);

  if (metadata === null){
    return <LoadingScreen datasetUrl={datasetUrl} setMetadataCallback={d => setMetadata(d)} />
  }

  return (
    <>
      <FpbCanvas metadata={metadata} />
      <Controls />
    </>
  )
}

export default ({style, datasetUrl}) => {
  return (
    <FPBioimageHolder style={style} >
      <FPBioimageApp datasetUrl={datasetUrl} />
    </FPBioimageHolder>
  );
};
