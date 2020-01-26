#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

void main() {
  gl_Position = u_worldViewProjection * a_position;
  // Normals are direction so we don't care about translation.
  // The orientation portion of the matrix is only in the top 3x3 area of the matrix.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}
