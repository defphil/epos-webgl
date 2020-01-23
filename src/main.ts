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

    // Delete vertex shader
    gl.detachShader(program, vertShader);
    gl.deleteShader(vertShader);

    gl.detachShader(program, fragShader);
    gl.deleteShader(fragShader);

    // Define colors 
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const fudgeLocation = gl.getUniformLocation(program, "u_fudgeFactor");
    const matUniformLocation = gl.getUniformLocation(program, "u_matrix");
    // VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // TODO: Define letter verts
    // Pass positions data
    const positions = require("./data/fm-letter-verts").default;
    const positionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);


    const colors = require("./data/fm-letter-colors").default;
    const colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);


    updateCanvasSize(gl, canvas);
    gl.clearColor(0.95, 0.95, 0.95, 1);
    gl.useProgram(program);


    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);    
    // ------------------------ WebGL BOILERPLATE ENDS HERE -------------------------------
    //@@ TODO: FIX CAMERA INVERSION!
    let fieldOfViewRadians = degToRad(90);
    let cameraAngleRadians = degToRad(0);
    
    const draw = () => {
	
	const num_of_objects = 5;
	const radius = 200;

	const aspect = canvas.clientWidth / canvas.clientHeight;
	const zNear = 1;
	const zFar = 2000;
	const pMat = M4.projectPerspective(fieldOfViewRadians, aspect, zNear, zFar);
	
	const cameraMat = M4.translate(M4.rotateY(cameraAngleRadians) , 0, 0, radius * 1.5);

	const viewMat = M4.inverse(cameraMat);
	const viewProjMat = M4.multiply(pMat, viewMat);

	for (var ii = 0; ii < num_of_objects; ++ii) {
	    let angle = ii * Math.PI * 2 / num_of_objects;
	    
	    const x = Math.cos(angle) * radius;
	    const z = Math.sin(angle) * radius;
	    
	    const matrix = M4.translate(viewProjMat, x, 0 , z);
	    
	    gl.uniformMatrix4fv(matUniformLocation, false, matrix);
	    gl.drawArrays(gl.TRIANGLES, 0, positions.length /3);
	}
	
        requestAnimationFrame(draw);
    };

    window.addEventListener("keydown", (e) => {
	if (e.key === "d") {
	    cameraAngleRadians += 0.02;
	}

	if (e.key === "a") {
	    cameraAngleRadians -= 0.02;
	}

    });

    window.addEventListener("resize", () => {
        updateCanvasSize(gl, canvas);
    });

    requestAnimationFrame(draw);
}

main();
