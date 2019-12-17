import React from 'react';

import {useLoader} from 'react-three-fiber';
import {TextureLoader} from 'three';

import FpbShader from './shader/FpbShader';
import {useStore} from './FpbContext';

export default () => {
  const roolUrl = 'https://fpb.ceb.cam.ac.uk/demo/examples/mrbrain-images/mrbrain_z';
  const numAtlases = 8;

  const urlList = [];
  for (let i = 0; i < numAtlases; i++){
    urlList.push(`${roolUrl}000${i}.png`);
  }

  const textureList = useLoader(TextureLoader, urlList);
  useStore(state => state.addToLoaded(1.0));

  let shader = FpbShader;
  shader.uniforms = {
    u_intensity: {value: 10.0},
    u_textures: {value: textureList},
  }

  return (
    <mesh position={[0,0,0]} scale={[2, 2, 2]}>
      <boxBufferGeometry attach="geometry" args={[1, 1]} />
      <shaderMaterial attach="material" {...shader}/>
    </mesh>
  )
}
