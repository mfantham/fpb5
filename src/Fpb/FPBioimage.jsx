import { useEffect, useState } from "react";
import styled from "styled-components";

import { Controls } from "./react-three-gui-fork";

import Annotation from "./bookmarks/Annotation";
import FpbCanvas from "./FpbCanvas";
import LoadingScreen from "../LoadingScreen";
import RecordingControls from "./leftMenu/RecordingControls";
import { useBookmarks } from "./hooks/useBookmarks";
import { EditSequence } from "./bookmarks/EditSequence";
import { useSequence } from "./hooks/useSequence";

const FPBioimageHolder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const FPBioimageApp = ({ datasetUrl }) => {
  const [metadata, setMetadata] = useState(null);
  const useBookmarksHook = useBookmarks();
  const useSequenceHook = useSequence();

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
        <FpbCanvas
          metadata={metadata}
          useBookmarks={useBookmarksHook}
          useSequence={useSequenceHook}
        />
      )}
      <RecordingControls
        useBookmarks={useBookmarksHook}
        useSequence={useSequenceHook}
      />
      <Controls />
      <Annotation useBookmarks={useBookmarksHook} />
      <EditSequence useSequence={useSequenceHook} />
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
