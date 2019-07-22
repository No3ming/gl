import {Component, OnInit} from '@angular/core';
import {createProgramFromText, resizeCanvasToDisplaySize} from '../../utils/gl-utils';

@Component({
  selector: 'app-gl-base',
  templateUrl: './gl-base.component.html',
  styleUrls: ['./gl-base.component.less']
})
export class GlBaseComponent implements OnInit {

  constructor() {

  }

  private vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;
  private fragmentShaderSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1, 0, 0.5, 1);
    }
  `;

  ngOnInit() {
    this.drawTriangles();
  }

  drawTriangles = () => {
    const canvas = document.querySelector('#c');
    // @ts-ignore
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.log('not gl');
      return;
    }
    const program = createProgramFromText(gl, this.vertexShaderSource, this.fragmentShaderSource);
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      0, 0,
      0, 0.5,
      .7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    resizeCanvasToDisplaySize(gl.canvas);
    // todo 废弃了么
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    const primitiveType = gl.TRIANGLES;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }
}
