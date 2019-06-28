import {Component, OnInit} from '@angular/core';
import {createProgramFromText, resizeCanvasToDisplaySize} from '../../utils/gl-utils';

@Component({
  selector: 'app-gl-uniform',
  templateUrl: './gl-uniform.component.html',
  styleUrls: ['./gl-uniform.component.less']
})
export class GlUniformComponent implements OnInit {

  constructor() {
  }
  // 注意gl函数结尾不能带；float 只能和float 计算
  private vertexShaderSource = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;
  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
  `;
  private fragmentShaderSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1, 0, 0.7, 1);
    }
  `;

  ngOnInit() {
    this.drawGl();
  }

  drawGl = () => {
    const canvas = document.querySelector('#c');
    // @ts-ignore
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.log('no gl');
      return;
    }
    const program = createProgramFromText(gl, this.vertexShaderSource, this.fragmentShaderSource);
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const position = [
      20, 20,
      100, 20,
      20, 100,
      20, 100,
      100, 100,
      100, 20
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const sride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, sride, offset);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    const primitive = gl.TRIANGLES;
    const count = 3;
    gl.drawArrays(primitive, offset, count);
  }
}
