import { useEffect } from "react";

export const useUniform = (uniform, controlVariable, ref) => {
  useEffect(() => {
    ref.current.uniforms[uniform].value = controlVariable;
  }, [uniform, ref, controlVariable]);
};
