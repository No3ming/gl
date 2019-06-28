attribute vec2 a_position;
attribute vec2 a_txtCoord;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
void main() {
  vec2 clipshap = a_position / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(clipshap * vec(1, -1), 0, 1);
  v_texCoord = a_texCoord;
}
