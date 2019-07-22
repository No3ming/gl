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
  gl = {};

  program = {};
  textures = []
  positionAttrLocation = [];
  positionBuffer = [];
  texcoordLocation = [];
  texCoordBuffer = [];
  textureSizeLocation = [];
  originalImageTexture = [];
  frameBuffers = []
  // tslint:disable-next-line:new-parens
  image: HTMLImageElement = new Image;
  flipYLocation = [];
  resolutionLocation = [];
  kernelLocation = [];
  kernelWeightLocation = [];

  ngOnInit() {
    this.main();
  }
  kernelChange = (index, e) => {
    this.effects[index].on = !this.effects[index].on;
    this.drawEffects(this.gl);
  }
  main = () => {
    const image = this.image = new Image();
    image.onload = () => {
      this.draw(image);
    };
    image.src = img;
  }
  draw = (image) => {
    const canvas = document.querySelector('#c');

    // @ts-ignore
    const gl = this.gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    this.gl = gl;
    const program = this.program = createProgramFromText(gl, vertSource, fragSource);
    this.positionAttrLocation = gl.getAttribLocation(program, 'a_position');
    // lookup uniforms
    this.texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const positionBuffer = this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    this.setRectangle(gl, 0, 0, image.width, image.height);
    const texCoordBuffer = this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);
    this.originalImageTexture = this.createAndSetupTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    const textures = this.textures = [];
    const frameBuffers = this.frameBuffers = [];
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
    this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    this.textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
    this.kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]');
    this.kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight');
    this.flipYLocation = gl.getUniformLocation(program, 'u_flipY');
    this.drawEffects(gl);
  }

  drawWithKernel = (name, gl) => {
    gl.uniform1fv(this.kernelLocation, this.kernels[name]);
    gl.uniform1f(this.kernelWeightLocation, this.computeKernelWeight(this.kernels[name]));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  drawEffects = (gl) => {
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    gl.enableVertexAttribArray(this.positionAttrLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(this.positionAttrLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.texcoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);
    // Tell it to use our program (pair of shaders)
    gl.uniform2f(this.textureSizeLocation, this.image.width, this.image.height);
    gl.bindTexture(gl.TEXTURE_2D, this.originalImageTexture);
    gl.uniform1f(this.flipYLocation, 1);
    const setFramebuffer = (fbo, width, height) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.uniform2f(this.resolutionLocation, width, height);
      gl.viewport(0, 0, width, height);
    };
    let count = 0;
    for (const ii in this.effects) {
      if (this.effects[ii].on) {
        // @ts-ignore
        setFramebuffer(this.frameBuffers[count % 2], this.image.width, this.image.height);
        this.drawWithKernel(this.effects[ii].name, gl);
        // @ts-ignore
        gl.bindTexture(gl.TEXTURE_2D, this.textures[ii % 2]);
        ++count;
      }
    }
    gl.uniform1f(this.flipYLocation, -1);
    setFramebuffer(null, this.image.width, this.image.height);
    this.drawWithKernel('normal', gl);
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
  }
  computeKernelWeight = (arr) => {
    const weight = arr.reduce((a, v) => a + v);
    return weight <= 0 ? 1 : weight;
  }
  setRectangle = (gl, x, y, width, height) => {
    const x1 = x;
    const y1 = y;
    const x2 = x + width;
    const y2 = y + height;
    const position = [
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  }

}
