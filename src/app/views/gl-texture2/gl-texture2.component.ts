import {Component, OnInit} from '@angular/core';
import {createProgramFromText, resizeCanvasToDisplaySize} from '../../utils/gl-utils';
// @ts-ignore
import vertSource from './vert.vert';
// @ts-ignore
import fragSource from './frag.frag';
// @ts-ignore
import img from './img.jpeg';

@Component({
  selector: 'app-gl-texture2',
  templateUrl: './gl-texture2.component.html',
  styleUrls: ['./gl-texture2.component.less']
})
export class GlTexture2Component implements OnInit {

  constructor() {
  }

  // Define several convolution kernels
  kernels = {
    normal: [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0
    ],
    gaussianBlur: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045
    ],
    gaussianBlur2: [
      1, 2, 1,
      2, 4, 2,
      1, 2, 1
    ],
    gaussianBlur3: [
      0, 1, 0,
      1, 1, 1,
      0, 1, 0
    ],
    unsharpen: [
      -1, -1, -1,
      -1, 9, -1,
      -1, -1, -1
    ],
    sharpness: [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ],
    sharpen: [
      -1, -1, -1,
      -1, 16, -1,
      -1, -1, -1
    ],
    edgeDetect: [
      -0.125, -0.125, -0.125,
      -0.125, 1, -0.125,
      -0.125, -0.125, -0.125
    ],
    edgeDetect2: [
      -1, -1, -1,
      -1, 8, -1,
      -1, -1, -1
    ],
    edgeDetect3: [
      -5, 0, 0,
      0, 0, 0,
      0, 0, 5
    ],
    edgeDetect4: [
      -1, -1, -1,
      0, 0, 0,
      1, 1, 1
    ],
    edgeDetect5: [
      -1, -1, -1,
      2, 2, 2,
      -1, -1, -1
    ],
    edgeDetect6: [
      -5, -5, -5,
      -5, 39, -5,
      -5, -5, -5
    ],
    sobelHorizontal: [
      1, 2, 1,
      0, 0, 0,
      -1, -2, -1
    ],
    sobelVertical: [
      1, 0, -1,
      2, 0, -2,
      1, 0, -1
    ],
    previtHorizontal: [
      1, 1, 1,
      0, 0, 0,
      -1, -1, -1
    ],
    previtVertical: [
      1, 0, -1,
      1, 0, -1,
      1, 0, -1
    ],
    boxBlur: [
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111,
      0.111, 0.111, 0.111
    ],
    triangleBlur: [
      0.0625, 0.125, 0.0625,
      0.125, 0.25, 0.125,
      0.0625, 0.125, 0.0625
    ],
    emboss: [
      -2, -1, 0,
      -1, 1, 1,
      0, 1, 2
    ]
  };
  kernels2 = {
    normal: [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0
    ],
    gaussianBlur: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045
    ],
    unsharpen: [
      -1, -1, -1,
      -1,  9, -1,
      -1, -1, -1
    ],
    emboss: [
      -2, -1,  0,
      -1,  1,  1,
      0,  1,  2
    ]
  }
  ngOnInit() {
    this.main();
  }

  main = () => {
    const image = new Image();
    image.onload = () => {
      this.draw(image);
    };
    image.src = img;
  }
  draw = (image) => {
    const canvas = document.querySelector('#c');

    // @ts-ignore
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    const program = createProgramFromText(gl, vertSource, fragSource);
    const positionAttrLocation = gl.getAttribLocation(program, 'a_position');
    // lookup uniforms
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
    const kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
    const kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');
    const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    this.setRectangle(gl, 0, 0, image.width, image.height);
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0
    ]), gl.STATIC_DRAW);
    // Create a texture.
    const createAndSetupTexture = (gl) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    createAndSetupTexture(gl);
    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    const drawWithKernel = (name) => {
      resizeCanvasToDisplaySize(gl.canvas);
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttrLocation);
      // 必须有
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttrLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texcoordLocation);
      // // Bind the position buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
      gl.uniform2f(textureSizeLocation, image.width, image.height);
      gl.uniform1fv(kernelLocation, this.kernels[name])
      gl.uniform1f(kernelWeightLocation, this.computeKernelWeight(this.kernels[name]));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    drawWithKernel('emboss');
  };
  computeKernelWeight = (arr) => {
    const weight = arr.reduce((a, v) => a + v);
    return weight <= 0 ? 1 : weight;
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  }

}
