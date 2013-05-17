// The "Storm Shader" by Dmytry Lavrov, Copyright 2012 (http://dmytry.com/) with permission from Moritz Helmsteadter at
// The Max Plank Institute is licensed under a Creative Commons attribution license http://creativecommons.org/licenses/by/3.0/
// free to share and remix for any purpose as long as it includes this note.
// Uses 'Computed noise' by Flavien Brebion.


#ifdef GL_ES
precision mediump float;
#endif

const float spin_speed = 1.0;

const int number_of_steps = 160; // number of isosurface raytracing steps
const float base_step_scaling = 0.6; // Larger values allow for faster rendering but cause rendering artifacts. When stepping the isosurface, the value is multiplied by this number to obtain the distance of each step
const float min_step_size = 0.4; // Minimal step size, this value is added to the step size, larger values allow to speed up the rendering at expense of artifacts.

 // input values passed into this shader
uniform float time; // use for blinking effects
uniform vec2 mouse; // currently unused
uniform vec2 resolution; // screen resolution

uniform mat4 camera_matrix;  // transform from camera to the world (not from the world to the camera

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

// 'Computed noise' by Flavien Brebion.
float snoise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + p.z * 137.0;
    float res = 1.0 - 2.0 * mix(
      mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x),
          f.y),
      mix(mix(hash(n + 137.0), hash(n + 138.0), f.x),
          mix(hash(n + 57.0 + 137.0), hash(n + 58.0 + 137.0), f.x),
          f.y),
      f.z
    );
    return res;
}

mat2 Spin(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float ridged(float f) {
  return 1.0 - 2.0 * abs(f);
}

// the isosurface shape function, the surface is at o(q)=0
float Shape(vec3 q) {
  float t = spin_speed * time;
  if (q.z < 0.0) return length(q);
  vec3 spin_pos = vec3(Spin(t - sqrt(q.z)) * q.xy, q.z - t * 5.0);
  float zcurve = pow(q.z, 1.5) * 0.03;
  float v = abs(length(q.xy) - zcurve) - 5.5 - clamp(zcurve * 0.2, 0.1, 1.0) * snoise(spin_pos * vec3(0.1, 0.1, 0.1)) * 5.0;
  v = v - ridged(snoise(vec3(Spin(t * 1.5 + 0.1 * q.z) * q.xy, q.z - t * 4.0) * 0.3)) * 1.2;
  return v;
}

 // calculates fog colour, and the multiplier for the colour of item behind the fog. If you do two intervals consecutively it will calculate the result correctly.
void FogStep(float dist, vec3 fog_absorb, vec3 fog_reemit, inout vec3 colour, inout vec3 multiplier) {
  vec3 fog = exp(-dist * fog_absorb);
  colour += multiplier * (vec3(1.0) - fog) * fog_reemit;
  multiplier *= fog;
}

const vec3 towards_sun = vec3(1, 1, 5.0);

void RaytraceFoggy(vec3 dir, float max_dist, inout vec3 colour, inout vec3 multiplier){
  vec3 org = camera_matrix[3].xyz; // origin of the ray
  vec3 q = org;
  vec3 pp;

  float d = 0.0;
  float old_d = d;
  float dist = 0.0;

  float step_scaling = base_step_scaling;

  const float extra_step = min_step_size;
  for (int i = 0; i < number_of_steps; i++) {
    old_d = d;
    float shape_value = Shape(q);
    float density = -shape_value;
    d = max(shape_value * step_scaling, 0.0);
    float step_dist = d + extra_step;

    if (density > 0.0) {
      float brightness = exp(-0.6 * density);
      FogStep(step_dist * 0.2, clamp(density, 0.0, 1.0) * vec3(1, 1, 1), vec3(1) * brightness, colour, multiplier);
    }

    if (dist > max_dist || multiplier.x < 0.01) {
      return;
    }

    dist += step_dist;
    q = org + dist * dir;
  }
  return;
}

void main(void) {
  vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
  p.y *= resolution.y / resolution.x;

  vec3 dir = normalize(vec3(p.x, p.y, 2.5));
  dir = (camera_matrix * vec4(dir, 0.0)).xyz;

  //Raymarching the isosurface:
  float dist;
  vec3 multiplier = vec3(1.0);
  vec3 color = vec3(0.0);
  RaytraceFoggy(dir, 200.0, color, multiplier);
  vec3 col= color * 0.3 + multiplier * vec3(0.05, 0.07, 0.2);
  gl_FragColor = vec4(col , 1.0);
}
