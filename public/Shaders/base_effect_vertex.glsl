
uniform float uTime;

varying vec2 vUv;
void main() {
    vUv = vec3( uv, 1 ).xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  //  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}