import * as THREE from 'three';

export const DIGIT_COLS = 5;
export const DIGIT_ROWS = 2;
export const DIGIT_COUNT = DIGIT_COLS * DIGIT_ROWS; // 0-9

// Builds one atlas texture containing digits 0-9, each cell glowing the
// same way a plain dot sprite used to, so particles render as numbers
// instead of blobs by sampling a different cell per-point.
export function makeDigitAtlasTexture() {
  const cell = 128;
  const canvas = document.createElement('canvas');
  canvas.width = cell * DIGIT_COLS;
  canvas.height = cell * DIGIT_ROWS;
  const ctx = canvas.getContext('2d');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${cell * 0.62}px 'Courier New', monospace`;

  for (let d = 0; d < DIGIT_COUNT; d++) {
    const col = d % DIGIT_COLS;
    const row = Math.floor(d / DIGIT_COLS);
    const cx = col * cell + cell / 2;
    const cy = row * cell + cell / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(255,255,255,0.95)';
    ctx.shadowBlur = cell * 0.22;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillText(String(d), cx, cy);
    ctx.fillText(String(d), cx, cy); // second pass deepens the glow
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Shared shader source for a digit-atlas point cloud. Any <points> using
// these needs an `aDigit` per-vertex attribute (0-9) alongside `position`.
export const digitVertexShader = `
  attribute float aDigit;
  varying float vDigit;
  uniform float uSize;
  void main() {
    vDigit = aDigit;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * (420.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const digitFragmentShader = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uCols;
  uniform float uRows;
  varying float vDigit;
  void main() {
    float col = mod(vDigit, uCols);
    float row = floor(vDigit / uCols);
    vec2 cellUv = (gl_PointCoord + vec2(col, row)) / vec2(uCols, uRows);
    cellUv.y = 1.0 - cellUv.y;
    vec4 tex = texture2D(uMap, cellUv);
    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
  }
`;
