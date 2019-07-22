import { Component, OnInit } from '@angular/core';
import { createProgramFromText, resizeCanvasToDisplaySize } from '../../utils/gl-utils';
// @ts-ignore
import vertexShaderSource from './vertex.vert';
// @ts-ignore
import fragmentShaderSource from './frag.frag';

@Component({
  selector: 'app-trasition2',
  templateUrl: './trasition2.component.html',
  styleUrls: ['./trasition2.component.less']
})
export class Trasition2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    this.main();
  }
  main = () => {
    const canvas = document.querySelector('#c');
    // @ts-ignore
    const gl = canvas.getContext('webgl');
    const program = createProgramFromText(gl, vertexShaderSource, fragmentShaderSource);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const trasitionLocation = gl.getUniformLocation(program, 'u_trasiton');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.useProgram(program);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(colorLocation, 200, 0, 200, 1);
    const position = [
      // 1
      0, 0,
      20, 0,
      0, 100,
      0, 100,
      20, 0,
      20, 100,
      // 2
      20, 0,
      100, 0,
      20, 20,
      20, 20,
      100, 20,
      100, 0,
      // 3
      20, 30,
      100, 30,
      20, 50,
      20, 50,
      100, 50,
      100, 30
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(gl, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(positionLocation);
    this.drawScene(gl, trasitionLocation, [0, 0]);
    setTimeout(() => {
      this.drawScene(gl, trasitionLocation, [100, 100]);
    }, 3000);
  }
  drawScene = (gl, trasitionLocation, trasition) => {
    gl.uniform2fv(trasitionLocation, trasition);
    const primitive = gl.TRIANGLES;
    const count = 6 * 3;
    const offset = 0;
    gl.drawArrays(primitive, offset, count);
  }
}
