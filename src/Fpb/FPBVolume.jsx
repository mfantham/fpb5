import React from 'react';

import {useLoader} from 'react-three-fiber';
import {TextureLoader} from 'three';
import {useControl} from 'react-three-gui';

import FpbMaterial from './FpbMaterial';

const calculateScale = (voxelSize, res, size) => {
  const {x, y, z} = voxelSize;
  const rawScale = [x * res[0], y * res[1], z * res[2]];
  const maxScale = Math.max(...rawScale);
  const scale = rawScale.map(v => v * size / maxScale);
  return scale;
}

const ceil2 = v => {
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
}

export default ({metadata}) => {
  if (metadata === null){
    return null;
  }

  const {images, voxelSize, sliceWidth, sliceHeight, numberOfImages, ...rest} = metadata;
  const textureList = useLoader(TextureLoader, images);

  const dataResolution = [ceil2(sliceWidth), ceil2(sliceHeight), numberOfImages];
  const qualityZ = useControl('Quality-Z', {type: 'number', value: 0.5, min: 0, max: 1.5});
  const opacity = useControl('Opacity', {type: 'number', value: metadata.opacity, min: 0, max: 8});
  const intensity = useControl('Intensity', {type: 'number', value: metadata.intensity, min: 0, max: 5.0});
  const threshold = useControl('Cutoff', {type: 'number', value: metadata.threshold, min: 0, max: 1.0});
  const size = useControl('Size', {type: 'number', value: 3.5, min: 0.1, max: 5});
  const scale = calculateScale(voxelSize, dataResolution, size);

  return (
    <mesh position={[0,0,0]} scale={scale}>
      <boxBufferGeometry attach="geometry" args={[1, 1]} />
      <FpbMaterial textureList={textureList} steps={512 * qualityZ} dataResolution={dataResolution} opacity={opacity} intensity={intensity} threshold={threshold} />
    </mesh>
  )
}
