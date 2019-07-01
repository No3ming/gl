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
  effects = [
    {name: 'gaussianBlur3', on: true},
    {name: 'gaussianBlur3', on: true},
    {name: 'gaussianBlur3', on: true},
    {name: 'sharpness'},
    {name: 'sharpness', on: true},
    {name: 'sharpness', on: true},
    {name: 'sharpen'},
    {name: 'sharpen'},
    {name: 'sharpen'},
    {name: 'unsharpen', on: true},
    {name: 'unsharpen'},
    {name: 'unsharpen'},
    {name: 'emboss', on: true},
    {name: 'edgeDetect'},
    {name: 'edgeDetect'},
    {name: 'edgeDetect3'},
    {name: 'edgeDetect3'},
  ];
  gl = {}

  ngOnInit() {
    this.main();
  }
  kernelChange = (index, e) => {
    this.effects[index].on = !this.effects[index].on
    this.drawEffects();
  }
  main = () => {
    const image = new Image();
    image.onload = () => {
      this.draw(image);
    };
    image.src = img;
  };
  draw = (image) => {
    const canvas = document.querySelector('#c');

    // @ts-ignore
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    this.gl = gl
    const program = createProgramFromText(gl, vertSource, fragSource);
    const positionAttrLocation = gl.getAttribLocation(program, 'a_position');
    // lookup uniforms
    const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    this.setRectangle(gl, 0, 0, image.width, image.height);
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);
    const originalImageTexture = this.createAndSetupTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    const textures = [];
    const frameBuffers = [];
    // tslint:disable-next-line:forin
    for (const ii in [0, 1]) {
      const texture = this.createAndSetupTexture(gl);
      textures.push(texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      const fbo = gl.createFramebuffer();
      frameBuffers.push(fbo);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
    const kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
    const kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');
    const flipYLocation = gl.getUniformLocation(program, 'u_flipY');
    const drawWithKernel = (name) => {
      gl.uniform1fv(kernelLocation, this.kernels[name])
      gl.uniform1f(kernelWeightLocation, this.computeKernelWeight(this.kernels[name]))
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    this.drawEffects = (name) => {
      const gl = this.gl
      resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttrLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttrLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(texcoordLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
      // Tell it to use our program (pair of shaders)
      gl.uniform2f(textureSizeLocation, image.width, image.height);
      gl.bindTexture(gl.TEXTURE_2D, originalImageTexture)
      gl.uniform1f(flipYLocation, 1);
      const setFramebuffer = (fbo, width, height) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.uniform2f(resolutionLocation, width, height);
        gl.viewport(0, 0, width, height);
      }
      let count = 0
      for (const ii in this.effects) {
        if (this.effects[ii].on) {
          // @ts-ignore
          setFramebuffer(frameBuffers[count % 2], image.width, image.height)
          drawWithKernel(this.effects[ii].name);
          // @ts-ignore
          gl.bindTexture(gl.TEXTURE_2D, textures[ii % 2]);
          ++count;
        }
      }
      gl.uniform1f(flipYLocation, -1);
      setFramebuffer(null, image.width, image.height)
      drawWithKernel('normal');
    };
    this.drawEffects('emboss');
  }

  createAndSetupTexture = (gl) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  };
  computeKernelWeight = (arr) => {
    const weight = arr.reduce((a, v) => a + v);
    return weight <= 0 ? 1 : weight;
  };
  setRectangle = (gl, x, y, width, height) => {
    const x1 = x;
    const y1 = y;
    const x2 = x + width;
    const y2 = y + height
    const position = [
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  };

}
