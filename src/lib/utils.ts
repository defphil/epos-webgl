export function createShader(gl: WebGL2RenderingContext, type: number, src:string) {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    const success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        const msg = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Failed to compile shader: " + msg);
    }

    return shader;
}

export function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success: boolean = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        const msg = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error("Failed to link the program: " + msg);
    }

    return program;
}

export function updateCanvasSize(gl: WebGL2RenderingContext, canvasElement: HTMLCanvasElement) {
    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;
    gl.viewport(0, 0, canvasElement.width, canvasElement.height);
}

export function getRandomInt(range: number) {
    return Math.floor(Math.random() * range);
}

export function degToRad(deg: number) {
    return deg * Math.PI / 180;
}
