import React, {useEffect, useRef} from 'react';

import FpbShader from './shader/FpbShader';
import {useUniform} from './useUniform';

export default ({textureList, steps, dataResolution, opacity, intensity, threshold}) => {
  const materialRef = useRef();

  const {width, height} = textureList[0].image;

  let shader = FpbShader;
  shader.uniforms = {
    u_opacity: {value: opacity},
    u_intensity: {value: intensity},
    u_threshold: {value: threshold},
    u_steps: {value: steps},
    u_dataResolution: {value: dataResolution},
    u_atlasResolution: {value: [width, height]},
    u_textures: {value: textureList},
  }

  useUniform('u_steps', steps, materialRef);
  useUniform('u_opacity', opacity, materialRef);
  useUniform('u_intensity', intensity, materialRef);
  useUniform('u_threshold', threshold, materialRef);
  useUniform('u_dataResolution', dataResolution, materialRef);



  return (
    <shaderMaterial attach="material" ref={materialRef} args={[shader]}/>
  )
}
