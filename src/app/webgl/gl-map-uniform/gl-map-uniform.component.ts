import {Component, OnInit} from '@angular/core';
import {createProgramFromText, resizeCanvasToDisplaySize} from '../../utils/gl-utils';
// @ts-ignore
import vertexShaderSource from './1.vert';

@Component({
  selector: 'app-gl-map-uniform',
  templateUrl: './gl-map-uniform.component.html',
  styleUrls: ['./gl-map-uniform.component.less']
})
export class GlMapUniformComponent implements OnInit {

  constructor() {
  }

  private vertexShaderSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    void main() {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 oneToTwo = zeroToOne * 2.0;
      vec2 clipSpace = oneToTwo - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
  `;
  private fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
      gl_FragColor = u_color / vec4(255, 255, 255, 1);
    }
  `;

  ngOnInit() {
    this.drawMoreGL();
  }

  drawMoreGL = () => {
    const canvas = document.querySelector('#c');
    // @ts-ignore
    const gl = canvas.getContext('webgl');
    const program = createProgramFromText(gl, vertexShaderSource, this.fragmentShaderSource);
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const size = 2;
    const type = gl.FLOAT;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    gl.useProgram(program);
    // 凭什么要绑定两次 issues
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalized, stride, offset);
    gl.enableVertexAttribArray(positionAttributeLocation);
    for (let ii = 0; ii <= 50; ii++) {
      this.setRectangle(
        gl,
        this.getRandom(300),
        this.getRandom(300),
        this.getRandom(300),
        this.getRandom(300)
      );
      gl.uniform4f(colorUniformLocation, this.getRandom(225), this.getRandom(225), this.getRandom(225), 1);
      const primitive = gl.TRIANGLES;
      const count = 6;
      gl.drawArrays(primitive, offset, count);
    }
  }
  getRandom = (clipSpace) => {
    return Math.floor(Math.random() * clipSpace);
  }
  setRectangle = (gl, x, y, w, h) => {
    const position = [
      x, y,
      x + w, y,
      x, y + h,
      x, y + h,
      x + w, y + h,
      x + w, y
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  }
}
