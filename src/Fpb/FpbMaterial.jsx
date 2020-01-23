import React, { useRef } from "react";

import FpbShader from "./shader/FpbShader";
import { useUniform } from "./useUniform";

export default ({ texture3d, steps, opacity, intensity, threshold }) => {
  const materialRef = useRef();

  let shader = FpbShader;
  shader.uniforms = {
    u_steps: { value: steps },
    u_opacity: { value: opacity },
    u_intensity: { value: intensity },
    u_threshold: { value: threshold },
    u_texture3d: { value: texture3d }
  };

  useUniform("u_steps", steps, materialRef);
  useUniform("u_opacity", opacity, materialRef);
  useUniform("u_intensity", intensity, materialRef);
  useUniform("u_threshold", threshold, materialRef);

  return <shaderMaterial attach="material" ref={materialRef} args={[shader]} />;
};
