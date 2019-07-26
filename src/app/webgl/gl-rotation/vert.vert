attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_trasiton;
uniform vec2 u_rotation;
void main() {
  vec2 rotationPosition = vec2(
  a_position.x * u_rotation.y + a_position.y * u_rotation.x,
  a_position.y * u_rotation.y - a_position.x * u_rotation.x
  );
  vec2 zeroToOne = rotationPosition / u_resolution;
  vec2 oneToTwo = zeroToOne * 2.0;
  vec2 trasition = u_trasiton / u_resolution;
  vec2 clipSpace = oneToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1) + trasition * vec2(1, -1), 0, 1);
}
