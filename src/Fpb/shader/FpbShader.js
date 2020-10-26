import FragmentShader from "./FpbFShader.js";
import VertexShader from "./FpbVShader.js";
import { BackSide } from "three";

const uniforms = {
  u_intensity: { value: 3.0 },
  u_textures: { value: [] }
};

export default {
  uniforms,
  vertexShader: VertexShader,
  fragmentShader: FragmentShader,
  side: BackSide
};
