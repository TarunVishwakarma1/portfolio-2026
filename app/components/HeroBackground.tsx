"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y; // Flip Y for WebGL texture
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_image_resolution;
  uniform float u_time;
  uniform vec2 u_mouse; // Mouse position (0 to 1)
  uniform sampler2D u_image;

  varying vec2 v_uv;

  // Simple random function for static noise
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Simple 2D noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    // object-fit: cover math
    vec2 ratio = vec2(
      min((u_resolution.x / u_resolution.y) / (u_image_resolution.x / u_image_resolution.y), 1.0),
      min((u_resolution.y / u_resolution.x) / (u_image_resolution.y / u_image_resolution.x), 1.0)
    );
    vec2 uv = vec2(
      v_uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      v_uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // Mouse influence (for glass only)
    float dist = distance(v_uv, u_mouse);
    float mouseHover = smoothstep(0.35, 0.0, dist);

    // Head/Neck mask — always used for melt + grain focus
    float neckDist = length(vec2(uv.x - 0.5, (uv.y - 0.55) * 1.2));
    float neckMask = smoothstep(0.45, 0.0, neckDist);

    // ── EFFECT 1: Melting / dripping distortion — ALWAYS ON ──────────────────
    float nMelt = snoise(uv * 4.0 + vec2(0.0, u_time * 0.5));
    // Base melt everywhere, boosted in neck zone
    float meltIntensity = 0.015 + (neckMask * 0.06);
    vec2 melt_uv = uv + vec2(nMelt * meltIntensity * 0.5, nMelt * meltIntensity);

    // ── EFFECT 2: Grainy static noise — ALWAYS ON in neck zone ───────────────
    float staticNoise = random(uv * 200.0 + u_time) * 2.0 - 1.0;
    float nGrain = snoise(uv * 12.0 + vec2(0.0, u_time * 1.5));
    float combinedNoise = nGrain * 0.4 + staticNoise * 0.6;
    float grainIntensity = 0.008 + (neckMask * 0.12);
    vec2 grain_uv = melt_uv + vec2(combinedNoise * grainIntensity * 0.6, combinedNoise * grainIntensity);

    // ── EFFECT 3: Glass lens bulge + chromatic aberration — CURSOR ONLY ──────
    vec2 dir = v_uv - u_mouse + vec2(0.0001);
    // Toned-down bulge — only activates near cursor
    vec2 bulge = normalize(dir) * mouseHover * 0.035;
    vec2 glass_uv = grain_uv + bulge;

    // Subtle chromatic aberration — scales with cursor proximity only
    float aberration = mouseHover * 0.008;
    float r = texture2D(u_image, glass_uv + vec2(aberration, 0.0)).r;
    float g = texture2D(u_image, glass_uv).g;
    float b = texture2D(u_image, glass_uv - vec2(aberration, 0.0)).b;

    vec4 color = vec4(r, g, b, 1.0);

    // Static grain color pop — always in neck zone
    color.rgb += staticNoise * neckMask * 0.12;
    // Slight brightness from glass edge near cursor
    color.rgb += mouseHover * 0.03;

    gl_FragColor = color;
  }
`;

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Compile Shader Function
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    // Geometry (Fullscreen Quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uImageResolution = gl.getUniformLocation(program, "u_image_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    gl.useProgram(program);

    // Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Placeholder while loading
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    let imgWidth = 1;
    let imgHeight = 1;

    const image = new Image();
    image.src = "/images/tv-hero-image.jpeg";
    image.onload = () => {
      imgWidth = image.width;
      imgHeight = image.height;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    let animationFrameId: number;
    const startTime = performance.now();
    // Default off-screen so glass is inactive on page load / mobile with no cursor
    const targetMouse = { x: -2, y: -2 };
    const currentMouse = { x: -2, y: -2 };

    const handlePointerMove = (e: PointerEvent) => {
      // Only track real mouse pointer, not touch
      if (e.pointerType === "mouse") {
        targetMouse.x = e.clientX / window.innerWidth;
        targetMouse.y = 1.0 - e.clientY / window.innerHeight;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      // On mobile, move the glass towards the finger touch
      const touch = e.touches[0];
      targetMouse.x = touch.clientX / window.innerWidth;
      targetMouse.y = 1.0 - touch.clientY / window.innerHeight;
    };
    const handleTouchEnd = () => {
      // Slide glass off-screen when finger lifts
      targetMouse.x = -2;
      targetMouse.y = -2;
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    const render = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for performance
      const displayWidth = Math.round(canvas.clientWidth * dpr);
      const displayHeight = Math.round(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Smooth mouse interpolation
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;

      gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(uImageResolution, imgWidth, imgHeight);
      gl.uniform1f(uTime, (time - startTime) * 0.001);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -2,
      }}
    />
  );
}
