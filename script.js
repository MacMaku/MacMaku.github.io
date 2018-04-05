var canvas = document.querySelector("canvas");
var toX = 0;
var toY = 0;
var slider = document.querySelector(".slider");
var pointsEl = document.querySelector(".points");
var moveX = 0;
var left;
var right;
var keepDoing = true;
var points =0;

slider.addEventListener("change", changeView);

// Get A WebGL context
/** @type {HTMLCanvasElement} */
var gl = canvas.getContext("webgl2");

// Use our boilerplate utils to compile the shaders and link into a program

var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
var program = createProgram(gl, vertexShader, fragmentShader);
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// look up uniform locations
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorLocation = gl.getUniformLocation(program, "u_color");
var matrixLocationRotateX = gl.getUniformLocation(program, "u_matrixRotateX");
var matrixLocationRotateY = gl.getUniformLocation(program, "u_matrixRotateY");
var matrixLocationRotateZ = gl.getUniformLocation(program, "u_matrixRotateZ");
var matrixLocationProjection = gl.getUniformLocation(
  program,
  "u_matrixProjection"
);
var matrixLocationCamera = gl.getUniformLocation(program, "u_matrixCamera");
var matrixLocationTranslate = gl.getUniformLocation(
  program,
  "u_matrixTranslate"
);
var matrixLocationScale = gl.getUniformLocation(program, "u_matrixScale");
var matrixLocationPerspective = gl.getUniformLocation(
  program,
  "u_matrixPerspective"
);

var fudgeFactor = 1;
// Create a buffer
var positionBuffer = gl.createBuffer();

// Create a vertex array object (attribute state)
var vao = gl.createVertexArray();

// and make it the one we're currently working with
gl.bindVertexArray(vao);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 3; // 3 components per iteration x,y,z
var type = gl.FLOAT; // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0; // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation,
  size,
  type,
  normalize,
  stride,
  offset
);

var obj = [];

var zNear = 0.01;
var zFar = 10;
var fieldOfViewRadians = 0.571975512;

generateObj(obj);
const drawScene = () => {
    if (obj.length < 50) {
      generateObj(obj);
    }
  // generate objs if neccessery

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  // Pass in the canvas resolution so we can convert from
  // pixels to clipspace in the shader
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // Update the position buffer with rectangle positions
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var primitiveType = gl.LINE_STRIP ;
  var offset = 0;
  //how many vertex we take from buffer at once
  var count = 36;
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  for (var i = 0; i < obj.length; i++) {
    gl.uniform4fv(colorLocation, obj[i].color);
    gl.uniformMatrix4fv(
      matrixLocationPerspective,
      false,
      m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
    );
   
    gl.uniformMatrix4fv(
      matrixLocationTranslate,
      false,
      m4.translation(...obj[i].translation)
    );
    gl.uniformMatrix4fv(
      matrixLocationCamera,
      false,
      m4.translation(...[moveX, 0, 0])
    );

    keepDoing = obj[i].collision(moveX);
    if(!keepDoing) stopDoing();
   
    obj[i].translation[2] += 0.1 + points/50000;

    // Draw the cube.
    obj[i].draw(gl);
//obj[i].rotate(2);
    gl.drawArrays(primitiveType, offset, count);
    if (obj[i].translation[2] > -0.2) {
      obj.splice(i, 1);
    }
  }
};

function changeView(e) {
  fieldOfViewRadians = degToRad(e.target.value);
}
function stopDoing(){
  clearInterval(timer);
}
var timer = setInterval(() => {
  points++;
  pointsEl.innerHTML = `Points: ${points}`;
  if (left === true && moveX < 0.95) {
    moveX += 0.05;
  } else if (right === true && moveX > -0.95) {
    moveX -= 0.05;
  }
 
  drawScene();
}, 40);

drawScene();

function generateObj(obj) {
  for (var i = 0; i < 100; i++)
    // params : size, angle, translationX,Y,Z, fudge
    obj.push(
      new Cube(
        0.07,
        Math.random(),
        random(),
        0,
        (-Math.random() * 100) % 20 -10,
        random()
      )
    );


    //(-Math.random() * 100) % 20 - 20
}

// movement

document.addEventListener("keydown", function(e) {
  const keyName = e.key;

  if (keyName === "a" || keyName === "ArrowLeft") {
    left = true;
    right = false;
  } else if (keyName === "d" || keyName === "ArrowRight") {
    left = false;
    right = true;
  }
});

document.addEventListener("keyup", function(e) {
  const keyName = e.key;

  if (keyName === "a" || keyName === "ArrowLeft") {
    left = false;
  }

  if (keyName === "d" || keyName === "ArrowRight") {
    right = false;
  }
});
