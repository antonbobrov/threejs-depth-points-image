varying vec2 vUv;
varying float vAlpha;
varying float vEdge;

uniform float u_edge;
uniform float u_maxDepth;

uniform sampler2D u_manDepthMap;

void main() {
  vUv = uv;
  vec3 transformed = vec3(position);

  vAlpha = distance(vUv, vec2(0.5));
  vAlpha = 1.0 - smoothstep(0.1, 0.5, vAlpha);

  vEdge = smoothstep(u_edge - 0.025, u_edge + 0.025, vUv.x);

  vec4 mapColor = texture2D(u_manDepthMap, vUv);
  
  float depth = (mapColor.r + mapColor.g, mapColor.b) / 3.0;
  transformed.z -= depth * u_maxDepth;

  gl_PointSize = 1.0 + vEdge;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
