varying vec2 vUv;
varying float vAlpha;
varying float vEdge;

uniform float u_time;
uniform sampler2D u_manDiffuseMap;

void main() {
  vec3 mapColor = texture2D(u_manDiffuseMap, vUv).rgb;
  mapColor = mix(mapColor, vec3(1.0), 1.0 - vEdge);

  if (vEdge > 0.0 && vEdge < 1.0) {
    mapColor.r = 0.0;
  }
  
  float noise = snoise(vec3(vUv, u_time * 0.0003) * 40.0);
  float alpha = 0.25 * vAlpha + (0.75 * vAlpha - noise * 0.5 * vAlpha) * vEdge;

  gl_FragColor = vec4(mapColor, alpha);
}
