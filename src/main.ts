import { M4 } from "./lib/M4";
import { createShader , createProgram, updateCanvasSize, degToRad } from "./lib/utils";

function main() {
    // Initialize canvas
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    // Initialize gl context
    const gl = canvas.getContext("webgl2");
    if (gl == null) {
        alert("WebGL2 is not supported by current browser");
        return;
    }

    // Create vertex shader
    const vertShaderSrc: string = require("./shaders/shader.vert").default;
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);

    // Create fragment shader
    const fragShaderSrc: string = require("./shaders/shader.frag").default;
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    
    // Create program
    const program = createProgram(gl, vertShader, fragShader);

    // Delete shaders
    gl.detachShader(program, vertShader);
    gl.deleteShader(vertShader);

    gl.detachShader(program, fragShader);
    gl.deleteShader(fragShader);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const normalsLocation = gl.getAttribLocation(program, "a_normal");
    
//  const fudgeLocation = gl.getUniformLocation(program, "u_fudgeFactor");
    const matUniformLocation = gl.getUniformLocation(program, "u_matrix");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
    
    // VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Pass positions data
    const positions = require("./data/fm-letter-verts").default;
    const positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);


    // const colors = require("./data/fm-letter-colors").default;
    // const colorsBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
    // gl.enableVertexAttribArray(colorLocation);
    // gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    // Creating buffer for normals
    const normals = require("./data/normals").default;
    const normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalsLocation);
    gl.vertexAttribPointer(normalsLocation, 3, gl.FLOAT, false, 0, 0);


    updateCanvasSize(gl, canvas);
    gl.clearColor(0.95, 0.95, 0.95, 1);
    gl.useProgram(program);


    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);    
    // ------------------------ WebGL BOILERPLATE ENDS HERE -------------------------------
    //@@ TODO: FIX CAMERA INVERSION!
    let fieldOfViewRadians = degToRad(90);
    let fRotationRadians = 0;
    
    const draw = () => {
        // Position of one locked F around which we'll move camera
        // Form projection
	    const aspect = canvas.clientWidth / canvas.clientHeight;
	    const zNear = 1;
	    const zFar = 2000;
        const projectionMat = M4.projectPerspective(fieldOfViewRadians, aspect, zNear, zFar);
        // Form camera
        const camera = [100, 150, 200];
        const target = [0, 35, 0];
        const up = [0, 1, 0];
        const cameraMat = M4.lookAt(camera, target, up);
        // Form view
        const viewMat = M4.inverse(cameraMat);
        const viewProjectionMat = M4.multiply(projectionMat, viewMat);
        const matrix = M4.multiply(viewProjectionMat, M4.rotateY(fRotationRadians));
	    
	    gl.uniformMatrix4fv(matUniformLocation, false, matrix);
        // Set the color to use in this case purple;
        gl.uniform4fv(colorLocation, [0.5, 0.1, 0.7, 1]);
        // normalized location is the location of the light source
        gl.uniform3fv(reverseLightDirectionLocation, M4.normalizeVec([0.5, 0.7, 1]));
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	    gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
        requestAnimationFrame(draw);
    };

    
    window.addEventListener("keydown", (e) => {
	    if (e.key === "d") {
            fRotationRadians += 0.1;
	    }
        
	    if (e.key === "a") {
            fRotationRadians -= 0.1;
	    }

    });

    window.addEventListener("resize", () => {
        updateCanvasSize(gl, canvas);
    });

    // draw everything
   requestAnimationFrame(draw);
}

main();
