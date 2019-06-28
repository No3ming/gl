import { Component, OnInit } from '@angular/core';
import {createProgramFromText, resizeCanvasToDisplaySize} from '../../utils/gl-utils';
// @ts-ignore
import vertSource from './vert.vert';
// @ts-ignore
import fragSource from './frag.frag';
// @ts-ignore
import img from './img.jpeg';

@Component({
  selector: 'app-gl-texture',
  templateUrl: './gl-texture.component.html',
  styleUrls: ['./gl-texture.component.less']
})
export class GlTextureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.main();
  }
  main = () => {
    const image = new Image()
    image.onload = () => {
      this.draw(image);
    }
    image.src = img;
  }
  draw = (image) => {
    const canvas = document.querySelector('#c');
    // @ts-ignore
    const gl = canvas.getContext('webgl');
    const program = createProgramFromText(gl, vertSource, fragSource);
    const positionAttrLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = gl.getAttribLocation(program, 'u_resolution');
    this.setRectangle( gl, 0, 0, image.width, image.height);
  }

  setRectangle = (gl, x, y, width, height) => {
    const position = [
      x, y,
      x + width, y,
      x, y + height,
      x, y + height,
      x + width, y + height,
      x + width, y
    ];
  }

}
