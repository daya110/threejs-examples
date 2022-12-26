
varying vec2 vUV;
varying vec3 vNormal;

void main() {
    vUV = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
