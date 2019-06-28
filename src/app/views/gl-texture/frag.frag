precision mediump float;

uniform vec2 u_textureSize;
uniform samper2d u_image;
uniform flaot u_kernel[9];
uniform flaot u_kernelWeight;
varying vec2 v_texCoord;
void main() {
  vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
  vec4 colorSum =
  textture2D(u_image, v_texCoord + onePixel  * vec2(-1,-1)) * u_kernel[0] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(0,-1)) * u_kernel[1] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(1,-1)) * u_kernel[2] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(-1,0)) * u_kernel[3] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(0,0)) * u_kernel[4] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(1,0)) * u_kernel[5] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(-1,1)) * u_kernel[6] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(0,1)) * u_kernel[7] +
  textture2D(u_image, v_texCoord + onePixel  * vec2(1,1)) * u_kernel[8];
  gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);
}
