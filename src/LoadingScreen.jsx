import React from 'react';
import styled from 'styled-components';
import Logo3D from './Logo3D';
import {useStore} from './Fpb/FpbContext';

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
`;

export default () => {
  const loaded = useStore(s => s.loaded);

  if (loaded >= 1){
    return null;
  }

  return (
    <LoadingHolder>
      <Logo3D />
      Loading {100 * loaded}%...
    </LoadingHolder>
  )

}
