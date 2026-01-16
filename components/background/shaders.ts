export const vertexShader = `
  attribute vec2 uv;
  attribute vec3 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
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
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    
    // Maintain aspect ratio for noise
    vec2 pos = vec2(st.x * (uResolution.x / uResolution.y), st.y);

    // Mouse influence
    vec2 mouse = uMouse / uResolution;
    float dist = distance(st, mouse);
    float mouseInteract = smoothstep(0.5, 0.0, dist) * 0.2;

    // Base noise layers
    float noise1 = snoise(pos * 0.8 + uTime * 0.1);
    float noise2 = snoise(pos * 2.0 - uTime * 0.15);
    
    // Combined flow
    float flow = (noise1 + noise2) * 0.5;
    
    // Color mixing
    // Background: Dark Ink (#04070b)
    vec3 bg = vec3(0.016, 0.027, 0.043);
    
    // Accent: Neon Green (#39ff14)
    vec3 accent = vec3(0.22, 1.0, 0.08);
    
    // Secondary: Darker/Softer Green
    vec3 secondary = vec3(0.1, 0.4, 0.15);

    // Mix based on noise and vertical gradient
    vec3 color = mix(bg, secondary, smoothstep(-0.8, 0.8, flow));
    
    // Add glowing spots
    float glow = smoothstep(0.4, 0.8, noise2 + mouseInteract);
    color = mix(color, accent, glow * 0.3);

    // Vignette
    float vignette = smoothstep(1.5, 0.5, distance(st, vec2(0.5)));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;
