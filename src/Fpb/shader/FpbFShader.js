export default `
uniform sampler2D u_textures[8];
uniform float u_intensity;

varying vec3 v_rayO;
varying vec3 v_rayD;

float u_slicesPerRow = 4.0;
float u_imageHeight = 256.0;
float u_imageWidth = 256.0;
float u_atlasHeight = 1024.0;
float u_atlasWidth = 1024.0;

vec3 u_volumeSizePixels = vec3(256, 256, 99);
int u_steps = 500;

const vec3 boxMin = vec3(-0.5);
const vec3 boxMax = vec3(+0.5);
const int MAX_STEPS = 768;

vec4 sample3D(vec3 rayTip) {
  vec3 rayTipPx = rayTip * u_volumeSizePixels;
  rayTipPx.z = floor(rayTipPx.z + 0.5); // hmm some dodgy flooring differences...

  int idx = int(mod(rayTipPx.z, 8.0));
  float z = floor(rayTipPx.z / 8.0);

  float xStart = mod(z, u_slicesPerRow) * u_imageWidth;
  float yStart = floor(z / u_slicesPerRow) * u_imageHeight;
  float x = xStart + rayTipPx.x;
  float y = yStart + rayTipPx.y;

  vec2 uv = vec2(x / u_atlasWidth, y / u_atlasHeight);

  vec4 src = vec4(0);
  if (all(greaterThan(uv,vec2(0))) && all(lessThan(uv, vec2(1)))){
    if (idx == 0) {
      src = texture2D(u_textures[0], uv);
    } else if (idx == 1) {
      src = texture2D(u_textures[1], uv);
    } else if (idx == 2) {
      src = texture2D(u_textures[2], uv);
    } else if (idx == 3) {
      src = texture2D(u_textures[3], uv);
    } else if (idx == 4) {
      src = texture2D(u_textures[4], uv);
    } else if (idx == 5) {
      src = texture2D(u_textures[5], uv);
    } else if (idx == 6) {
      src = texture2D(u_textures[6], uv);
    } else if (idx == 7) {
      src = texture2D(u_textures[7], uv);
    }
  } else {
    src = vec4(1, 0, 1, 1);
  }
  return src;
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
  vec2 hitDistance = volumeIntersects(v_rayO, v_rayD);
  float hitNear = hitDistance.x;
  float hitFar = hitDistance.y;
  if (hitFar <= hitNear){
    discard;
  }
  if (hitNear < 0.0) {
    hitNear = 0.0;
  }

  vec3 startPoint = 0.5 + v_rayO + v_rayD * hitNear;
  vec3 endPoint = 0.5 +  v_rayO + v_rayD * hitFar;

  vec3 rayPosition = startPoint;
  vec3 rayDirection = endPoint - startPoint;
  vec3 rayStep = 1.73 * normalize(rayDirection) / float(u_steps);

  vec4 rayColor = vec4(0);

  for (int s = 0; s < MAX_STEPS; s++){
    if (s < u_steps){
      vec3 rayPosition = startPoint + float(s) * rayStep;
      if (all(lessThan(rayPosition, vec3(1))) && all(greaterThan(rayPosition, vec3(0)))) {
        vec4 voxelColor = sample3D(rayPosition);

        // grayscale max intensity shader
        // if (voxelColor.r > rayColor.r){
        //   rayColor = vec4(voxelColor.rgb, 1);
        // }


        // Composting shader
        voxelColor.a *= 0.1; // opacity
        voxelColor.rgb *= voxelColor.a;
        rayColor += (1.0 - rayColor.a) * voxelColor;

        // rainbow test cube
        // rayColor = vec4(rayPosition, 1);
      }
    }
  }
  if (rayColor.r < 0.1){
    discard;
  }

  gl_FragColor = rayColor * u_intensity;
}
`;
