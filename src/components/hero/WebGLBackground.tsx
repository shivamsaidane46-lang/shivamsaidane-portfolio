import { useEffect, useRef } from 'react';

/**
 * WebGLBackground — renders the cinematic simplex-noise nebula shader
 * from the Stitch cinematic reference (ANIMATION_6).
 *
 * Responds live to mouse position via u_mouse uniform.
 * Uses WebGL1 for maximum browser compatibility.
 */
export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size canvas to viewport
    const syncSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
      }
    };
    syncSize();

    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
            ?? canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    // ── Vertex Shader ──────────────────────────────────────────
    const VS = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    // ── Fragment Shader (simplex noise nebula) ────────────────
    const FS = `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
varying vec2  v_texCoord;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 st    = gl_FragCoord.xy / u_resolution.xy;
  vec2 mouse = u_mouse / u_resolution.xy;
  vec2 p     = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  float t    = u_time * 0.18;

  vec2 mOffset = (mouse - 0.5) * 0.35;
  vec2 pos     = p + mOffset;

  float n1 = snoise(pos * 1.2 + vec2(t * 0.4, -t * 0.3));
  float n2 = snoise(pos * 2.4 - vec2(-t * 0.2, t * 0.5) + n1 * 0.5);
  float n3 = snoise(pos * 4.2 + vec2(t * 0.3, t * 0.1) + n2 * 0.35);

  float distFromCenter = length(pos - vec2(0.0, -1.35));
  float ringGlow  = smoothstep(1.8, 1.1, distFromCenter) * 0.45;
  float upperGlow = smoothstep(1.5, 0.2, length(pos - vec2(0.3, 0.8))) * 0.25;

  vec3 spaceVoid     = vec3(0.015, 0.02, 0.04);
  vec3 deepNavy      = vec3(0.02, 0.08, 0.22);
  vec3 electricCyan  = vec3(0.0, 0.82, 0.98);
  vec3 cosmicViolet  = vec3(0.48, 0.15, 0.88);
  vec3 starlight     = vec3(0.85, 0.95, 1.0);

  float nebula      = smoothstep(-0.25, 0.85, n2 * 0.65 + n3 * 0.35);
  float violetSpill = smoothstep(-0.1,  0.9,  n1 * 0.7  + n3 * 0.3);

  vec3 color = spaceVoid;
  color = mix(color, deepNavy,     nebula      * 0.85);
  color = mix(color, cosmicViolet, violetSpill * 0.42);
  color = mix(color, electricCyan, pow(nebula, 2.2) * 0.55);
  color += electricCyan * ringGlow  * 0.65;
  color += cosmicViolet * upperGlow * 0.4;

  float stars = pow(max(0.0, snoise(pos * 45.0 + vec2(t * 0.05, 0.0))), 16.0) * 1.8;
  color += starlight * stars;

  float vig = 1.0 - smoothstep(0.5, 1.6, length(p * 0.85));
  color *= vig;

  gl_FragColor = vec4(color, 1.0);
}`;

    // ── Compile & Link ─────────────────────────────────────────
    const compileShader = (type: number, src: string): WebGLShader => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // ── Geometry (full-screen quad) ────────────────────────────
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, 'u_time');
    const uRes   = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouse.x = ((e.clientX - rect.left) / rect.width)  * canvas.width;
        mouse.y = (1 - (e.clientY - rect.top) / rect.height) * canvas.height;
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', syncSize);

    let rafId = 0;
    const render = (t: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime)  gl.uniform1f(uTime,  t * 0.001);
      if (uRes)   gl.uniform2f(uRes,   canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', syncSize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        opacity: 0.82,
        pointerEvents: 'none',
      }}
    />
  );
}
