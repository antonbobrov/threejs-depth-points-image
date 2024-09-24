varying vec2 vUv;
varying float noise;

uniform float u_time;

void main() {
  vUv = uv;
  vec3 transformed = vec3(position);

  noise = snoise(vec3(vUv, u_time * 0.010) * 500.0);

  transformed.x += noise * 20.0;
  transformed.y -= noise * 20.0;
  
  gl_PointSize = 1.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
