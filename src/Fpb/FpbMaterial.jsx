import React, { useRef } from "react";

import FpbShader from "./shader/FpbShader";
import { useUniform } from "./hooks/useUniform";

const FpbMaterial = ({
  texture3d,
  steps,
  interpolation,
  projection,
  opacity,
  intensity,
  threshold,
  clippingPlane,
}) => {
  const materialRef = useRef();

  let shader = FpbShader;
  shader.uniforms = {
    u_steps: { value: steps },
    u_interpolation: { value: interpolation },
    u_projection: { value: projection },
    u_opacity: { value: opacity },
    u_intensity: { value: intensity },
    u_threshold: { value: threshold },
    u_texture3d: { value: texture3d },
    u_clipping_on: { value: clippingPlane.active },
    u_clipping_normal: { value: clippingPlane.normal },
    u_clipping_offset: { value: clippingPlane.constant },
  };

  useUniform("u_steps", steps, materialRef);
  useUniform("u_interpolation", interpolation, materialRef);
  useUniform("u_projection", projection, materialRef);
  useUniform("u_opacity", opacity, materialRef);
  useUniform("u_intensity", intensity, materialRef);
  useUniform("u_threshold", threshold, materialRef);

  useUniform("u_clipping_on", clippingPlane.active, materialRef);
  useUniform("u_clipping_normal", clippingPlane.normal, materialRef);
  useUniform("u_clipping_offset", clippingPlane.constant, materialRef);

  return <shaderMaterial attach="material" ref={materialRef} args={[shader]} />;
};

export default FpbMaterial;
