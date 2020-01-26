export default `
precision highp float;
precision mediump sampler3D;


uniform sampler3D u_texture3d;
uniform float u_opacity;
uniform float u_intensity;
uniform float u_threshold;
uniform int u_steps;
uniform bool u_clipping_on;
uniform vec3 u_clipping_normal;
uniform float u_clipping_offset;

varying vec3 v_rayO;
varying vec3 v_rayD;

const vec3 boxMin = vec3(-0.5);
const vec3 boxMax = vec3(+0.5);
const int MAX_STEPS = 768;
const float sqrt3 = 1.73205080757;

float meanColor(vec3 rgbPixel){
  return (rgbPixel.r + rgbPixel.g + rgbPixel.b);
}

vec4 sample3D(vec3 rayTip) {
  rayTip.y = 1.0 - rayTip.y;
  return texture(u_texture3d, rayTip);
}

vec2 volumeIntersects(vec3 rayOrigin, vec3 rayDirection){
  vec3 hit1 = (boxMin - rayOrigin) / rayDirection;
  vec3 hit2 = (boxMax - rayOrigin) / rayDirection;
  vec3 tMin = min(hit1, hit2);
  vec3 tMax = max(hit1, hit2);
  float largest_tMin = max(tMin.x, max(tMin.y, tMin.z));
  float smallest_tMax = min(tMax.x, min(tMax.y, tMax.z));
  return vec2(largest_tMin, smallest_tMax);
}

void main() {
  float normalised_opacity = 256.0 * saturate(u_opacity / float(u_steps));

  vec2 hitDistance = volumeIntersects(v_rayO, v_rayD);
  float hitNear = hitDistance.x;
  float hitFar = hitDistance.y;
  if (hitFar <= hitNear){
    discard;
  }
  if (hitNear < 0.0) {
    hitNear = 0.0;
  }

  vec3 startPoint = v_rayO + v_rayD * hitNear;
  vec3 endPoint = v_rayO + v_rayD * hitFar;

  vec3 rayPosition = startPoint;
  vec3 rayDirection = endPoint - startPoint;
  vec3 rayStep = sqrt3 * normalize(rayDirection) / float(u_steps);

  vec4 rayColor = vec4(0);

  for (int s = 0; s < MAX_STEPS; s++){
    if (s < u_steps){
      vec3 rayPosition = startPoint + float(s) * rayStep;
      bool clip = u_clipping_on && dot(rayPosition, u_clipping_normal) < -u_clipping_offset;
      if (!clip && all(lessThan(rayPosition, vec3(0.5))) && all(greaterThan(rayPosition, vec3(-0.5)))) {
        vec4 voxelColor = sample3D(rayPosition + 0.5);
        float voxelGray = meanColor(voxelColor.rgb);

        // grayscale max intensity shader
        // if (voxelColor.r > rayColor.r){
        //   rayColor = vec4(voxelColor.rgb, 1);
        // }


        // Composting shader
        if (voxelGray > u_threshold){
          voxelColor.a *= normalised_opacity; // opacity
          voxelColor.rgb *= voxelColor.a;
          rayColor += (1.0 - rayColor.a) * voxelColor;
        }

        // rainbow test cube
        // rayColor = vec4(rayPosition, 1);
      }
    }
  }
  if (meanColor(rayColor.rgb) < u_threshold) discard;

  gl_FragColor = rayColor * u_intensity;
}
`;
