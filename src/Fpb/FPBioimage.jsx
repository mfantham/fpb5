import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Controls } from "./react-three-gui-fork";

import Annotation from "./bookmarks/Annotation";
import FpbCanvas from "./FpbCanvas";
import LoadingScreen from "../LoadingScreen";
import RecordingControls from "./leftMenu/RecordingControls";
import { useBookmarks } from "./hooks/useBookmarks";

const FPBioimageHolder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const FPBioimageApp = ({ datasetUrl }) => {
  const [metadata, setMetadata] = useState(null);
  const useBookmarksHook = useBookmarks();

  useEffect(() => {
    setMetadata(null);
  }, [datasetUrl]);

  if (metadata === null) {
    return (
      <LoadingScreen
        datasetUrl={datasetUrl}
        setMetadataCallback={(d) => setMetadata(d)}
      />
    );
  }

  return (
    <>
      {!!metadata && (
        <FpbCanvas metadata={metadata} useBookmarks={useBookmarksHook} />
      )}
      <RecordingControls useBookmarks={useBookmarksHook} />
      <Controls />
      <Annotation useBookmarks={useBookmarksHook} />
    </>
  );
};

const FPBioimage = ({ style, datasetUrl }) => {
  return (
    <FPBioimageHolder style={style}>
      <FPBioimageApp datasetUrl={datasetUrl} />
    </FPBioimageHolder>
  );
};

export default FPBioimage;
