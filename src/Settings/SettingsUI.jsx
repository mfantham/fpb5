import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
  return (
    <>
      <LeftPanel>
        aa
      </LeftPanel>
      <RightPanel>
        bb
      </RightPanel>
    </>
  );
};
