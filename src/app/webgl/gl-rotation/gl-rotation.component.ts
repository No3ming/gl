import {Component, OnInit} from '@angular/core';
import {createProgramFromText, resizeCanvasToDisplaySize} from '../../utils/gl-utils';
// @ts-ignore
import vertSource from './vert.vert';
// @ts-ignore
import fragSource from './frag.frag';

@Component({
  selector: 'app-gl-rotation',
  templateUrl: './gl-rotation.component.html',
  styleUrls: ['./gl-rotation.component.less']
})
export class GlRotationComponent implements OnInit {
  constructor() {
  }
  program?: WebGLProgram = undefined;
  gl?: WebGLRenderingContext = undefined
  angle = 0
  ngOnInit() {
    this.onDraw();
  }

  onDraw = () => {
    const canvas = document.querySelector('#c');
    // @ts-ignore
    const gl = this.gl = canvas.getContext('webgl');
    console.log(gl)
    if (!gl) {
      return new Error('no webgl');
    }
    const program = this.program = createProgramFromText(gl, vertSource, fragSource);
    const positionsAttrLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.useProgram(program)
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(colorUniformLocation, 100, 100, 100, 1);
    const trasitonUniformLocation = gl.getUniformLocation(program, 'u_trasiton')
    gl.uniform2f(trasitonUniformLocation, 200, 200)
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
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(gl, 2,  gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(positionsAttrLocation);
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this.onEnterDraw();
  }
  onEnterDraw = () => {
    const gl = this.gl
    const angle = 360 - this.angle
    this.angle += 0.01
    const rotation = [Math.sin(angle), Math.cos(angle)]
    const rotationUniformLocation = gl.getUniformLocation(this.program, 'u_rotation');
    gl.uniform2fv(rotationUniformLocation, rotation);
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.clearColor(0, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * 3);
    requestAnimationFrame(this.onEnterDraw);
  }
}
