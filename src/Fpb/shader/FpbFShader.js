const FpbFShader = `
precision highp float;
precision mediump sampler3D;

uniform sampler3D u_texture3d;
uniform int u_steps;
uniform int u_interpolation;
uniform int u_projection;
uniform float u_opacity;
uniform float u_intensity;
uniform float u_threshold;
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
  if (u_interpolation > 0) {
    vec3 rayTip1 = rayTip;
    vec3 rayTip2 = rayTip;

    rayTip1.z = floor(rayTip1.z * float(u_interpolation)) / float(u_interpolation);
    rayTip2.z = ceil(rayTip2.z * float(u_interpolation)) / float(u_interpolation);

    vec4 pixel1 = texture(u_texture3d, rayTip1);
    vec4 pixel2 = texture(u_texture3d, rayTip2);
    float lerp = (rayTip2.z - rayTip.z) / (rayTip2.z - rayTip1.z);
    if (rayTip1.z == rayTip2.z){
      lerp = 1.0;
    }
    return mix(pixel2, pixel1, lerp);
  } else {
    return texture(u_texture3d, rayTip);
  }
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
  float threshold = 3.0 * u_threshold;

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
        if (voxelGray < threshold) continue;

        if (u_projection == 0){
          // Composting shader
          voxelColor.a *= normalised_opacity; // opacity
          voxelColor.rgb *= voxelColor.a;
          rayColor += (1.0 - rayColor.a) * voxelColor;
        }

        if (u_projection == 1){
          // max intensity
          rayColor = max(voxelColor, rayColor);
        }

        if (u_projection == 2 && voxelGray > meanColor(rayColor.rgb)){
          // max intensity average
          rayColor = vec4(voxelColor.rgb, 1);
        }

        if (u_projection == 3){
          // rainbow test cube
          rayColor = vec4(rayPosition, 1);
        }
      }
    }
  }
  if (meanColor(rayColor.rgb) < threshold) discard;
  if (u_projection == 1 || u_projection == 2) rayColor.a = u_opacity;

  gl_FragColor = rayColor * u_intensity;
}
`;

export default FpbFShader;
