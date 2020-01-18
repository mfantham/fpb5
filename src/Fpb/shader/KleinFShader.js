export default `
varying vec3 v_position;
varying vec3 v_viewRay;
varying vec3 v_nearPos;

vec3 u_size = vec3(2, 2, 2); // will be a uniform ;)

const int MAX_STEPS = 887;	// 887 for 512^3, 1774 for 1024^3
const int REFINEMENT_STEPS = 4;

void main() {

  // Distance to front surface
  float distance = dot(v_nearPos - v_position, v_viewRay);

  // This bit confusing.
  // distance = max(distance, min((-0.5 - v_position.x) / v_viewRay.x, (u_size.x - 0.5 - v_position.x) / v_viewRay.x));
  // distance = max(distance, min((-0.5 - v_position.y) / v_viewRay.y, (u_size.y - 0.5 - v_position.y) / v_viewRay.y));
  // distance = max(distance, min((-0.5 - v_position.z) / v_viewRay.z, (u_size.z - 0.5 - v_position.z) / v_viewRay.z));

  // Various tests
  gl_FragColor = vec4(1, 0, 0, 0.8);
  gl_FragColor = vec4(v_viewRay, 0.8);
  gl_FragColor = vec4(-distance, -distance, 0, 0.8);
}
`;
