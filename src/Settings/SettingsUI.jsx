import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useSlider } from "./useSlider";

const Panel = styled.div`
  position: absolute;
  top: 0;
  width: 300px;
  backdrop-filter: blur(20px);
  height: 100%;
  color: white;
`;

const LeftPanel = styled(Panel)`
  left: 0;
`;

const RightPanel = styled(Panel)`
  right: 0;
`;

export default () => {
  const quality = useSlider(0.1, 1, 0.05, 0.5, "Quality", "qualitySlider");
  const intensity = useSlider(1, 10, 0.5, 3, "Itensity", "intensitySlider");

  return (
    <>
      <LeftPanel>
        <input {...quality} />
      </LeftPanel>
      <RightPanel>
        Intensity
        <input {...intensity} />
      </RightPanel>
    </>
  );
};
