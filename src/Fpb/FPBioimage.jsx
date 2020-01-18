import React, {useState} from 'react';
import styled from 'styled-components';

import FpbCanvas from './FpbCanvas';

import LoadingScreen from '../LoadingScreen';

import Logo3D from '../Logo3D';

const FPBioimageHolder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default () => {
  const [metadata, setMetadata] = useState(null);

  return (
      <FPBioimageHolder>
        <FpbCanvas metadata={metadata} />
        {metadata === null && <LoadingScreen setMetadataCallback={d => setMetadata(d)} />}
      </FPBioimageHolder>
  );
}
