varying vec2 vUv;
varying float noise;

void main() {
  vec3 color = vec3(0.18, 0.92, 0.91);

  gl_FragColor = vec4(color, noise);
}
