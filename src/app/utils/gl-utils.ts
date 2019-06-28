// 创建着色程序
export const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw new Error('program filed to link:' + gl.getProgramInfoLog(program));
  }
  return program;
};


/**
 * 创建并编译一个着色器
 */
export const compileShader = (gl, shaderSource, shaderType) => {
  // 创建着色器程序
  const shader = gl.createShader(shaderType);

  // 设置着色器的源码
  gl.shaderSource(shader, shaderSource);

  // 编译着色器
  gl.compileShader(shader);
  // 检测编译是否成功
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // 编译过程出错，获取错误信息。
    throw new Error('could not compile shader:' + gl.getShaderInfoLog(shader));
  }

  return shader;
};

export const createShaderFromScript = (gl, scriptId: string, optShaderType?: number) => {
  // 通过id找到script标签
  // @ts-ignore
  const shaderScript: HTMLScriptElement = document.getElementById(scriptId);
  if (!shaderScript) {
    throw new Error('*** Error: unknown script element' + scriptId);
  }

  // 提取标签内容。
  const shaderSource: string = shaderScript.text;

  // 如果没有传着色器类型，就使用标签的 ‘type’ 属性
  if (!optShaderType) {
    if (shaderScript.type === 'x-shader/x-vertex') {
      optShaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type === 'x-shader/x-fragment') {
      optShaderType = gl.FRAGMENT_SHADER;
    } else if (!optShaderType) {
      throw new Error('*** Error: shader type not set');
    }
  }
  return compileShader(gl, shaderSource, optShaderType);
};

export const createShaderFormText = (gl, shaderText: string, optShaderType: number) => {
  return compileShader(gl, shaderText, optShaderType);
}

/**
 * 使用script标签获取gl代码
 */
export const createProgramFromScripts = (gl, vertexShaderId: string, fragmentShaderId: string) => {
  const vertexShader = createShaderFromScript(gl, vertexShaderId, gl.VERTEX_SHADER);
  const fragmentShader = createShaderFromScript(gl, fragmentShaderId, gl.FRAGMENT_SHADER);
  return createProgram(gl, vertexShader, fragmentShader);
}

// 已经直接获取到gl代码
export const createProgramFromText = (gl, vertexShaderText: string, fragmentShaderText: string) => {
  const vertexShader = createShaderFormText(gl, vertexShaderText, gl.VERTEX_SHADER);
  const fragmentShader = createShaderFormText(gl, fragmentShaderText, gl.FRAGMENT_SHADER);
  return createProgram(gl, vertexShader, fragmentShader);
}

// 重置画布大小
export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement, multiplier?: number) => {
  multiplier = multiplier || 1;
  /*tslint:disable:no-bitwise*/
  const width  = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width ||  canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
    return true;
  }
  return false;
}
