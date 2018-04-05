var vertexShaderSource = `#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// A matrix to transform the positions by
uniform mat4 u_matrixRotateX;
uniform mat4 u_matrixRotateY;
uniform mat4 u_matrixRotateZ;
uniform mat4 u_matrixTranslate;
uniform mat4 u_matrixScale;
uniform mat4 u_matrixPerspective;
uniform mat4 u_matrixProjection;
uniform mat4 u_matrixCamera;
 
// all shaders have a main function
void main() {

 // vec4 position =  u_matrixPerspective * u_matrixTranslate u_matrixCameraTranslate ;
  
  // Multiply the position by the matrix.
  gl_Position =   u_matrixPerspective *  u_matrixCamera  * u_matrixTranslate  *  a_position ;
}
`;