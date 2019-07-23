attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_trasiton;
uniform vec2 u_rotation;
void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 oneToTwo = zeroToOne * 2.0;
  vec2 trasition = u_trasiton / u_resolution;
  vec2 clipSpace = oneToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1) + trasition * vec2(1, -1), 0, 1);
}
