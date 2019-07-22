import { Component, OnInit } from '@angular/core';
import {createProgramFromText} from '../../utils/gl-utils';
@Component({
  selector: 'app-gl-rotation',
  templateUrl: './gl-rotation.component.html',
  styleUrls: ['./gl-rotation.component.less']
})
export class GlRotationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  onDraw() {
    const canvas = document.querySelector('#c');
    // @ts-ignore
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return new Error('no webgl');
    }
    const propame = createProgramFromText
  }
}
