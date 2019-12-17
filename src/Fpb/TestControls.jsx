import React, {useRef} from 'react';
import { extend, useThree, useFrame } from 'react-three-fiber';
import {OrbitControls} from 'three-full';

import {useFpbContext} from './FpbContext';

extend({OrbitControls});

export default ({domReference}) => {
  const ref = useRef()
  const { camera } = useThree()
  useFrame(() => ref.current.update())
  return <orbitControls ref={ref} args={[camera, domReference.current]} />
}
