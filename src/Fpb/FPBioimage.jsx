import React from 'react';
import styled from 'styled-components';

import FpbCanvas from './FpbCanvas';
import {FpbContextProvider} from './FpbContext';

import LoadingScreen from '../LoadingScreen';

import SettingsUI from '../Settings/SettingsUI';

const FPBioimageHolder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default () => {
  return (
      <FPBioimageHolder>
        <FpbCanvas />
        <LoadingScreen />
        <SettingsUI />
      </FPBioimageHolder>
  );
}
