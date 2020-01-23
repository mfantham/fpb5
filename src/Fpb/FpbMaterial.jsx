import React, { useRef } from "react";

import FpbShader from "./shader/FpbShader";
import { useUniform } from "./useUniform";
import { useControl } from "react-three-gui";

export default ({ texture3d, steps, opacity, intensity, threshold, clippingPlane }) => {
  const materialRef = useRef();
  const [x, y, d] = clippingPlane;

  let shader = FpbShader;
  shader.uniforms = {
    u_steps: { value: steps },
    u_opacity: { value: opacity },
    u_intensity: { value: intensity },
    u_threshold: { value: threshold },
    u_texture3d: { value: texture3d },
    u_clip_rotation: {value: [x, y]},
    u_clip_offset: {value: d}
  };

  useUniform("u_steps", steps, materialRef);
  useUniform("u_opacity", opacity, materialRef);
  useUniform("u_intensity", intensity, materialRef);
  useUniform("u_threshold", threshold, materialRef);

  useUniform("u_clip_rotation", [x, y], materialRef);
  useUniform("u_clip_offset", d, materialRef);

  return <shaderMaterial attach="material" ref={materialRef} args={[shader]} />;
};
