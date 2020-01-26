#version 300 es

precision mediump float;

in vec3 v_normal;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

out vec4 outColor;

void main() {
     vec3 normal = normalize(v_normal);
     float light = dot(normal, u_reverseLightDirection);

     outColor = u_color;

     outColor.rgb *= light;
}
