/**
 * 히어로 배경의 신호 리본 — 헤어라인 수십 개가 꼬인 띠 두 겹을 이루고, 스크롤
 * 진행률이 띠의 자리·크기·꼬임·물결을 민다.
 *
 * DOM을 모르는 순수 함수다. 같은 (w, h, p, palette)면 같은 그림이 나오므로
 * 리사이즈나 테마 전환에서 다시 그려도 안전하고, 난수가 없어 프레임 사이에
 * 떨림이 없다. 호출자가 DPR 변환을 먼저 걸어 두면 여기서는 CSS 픽셀만 다룬다.
 */

export interface RibbonPalette {
  /** 띠의 중심을 그리는 액센트. `--color-accent` 계산값 그대로. */
  accent: string;
  /** 띠의 가장자리에서 액센트를 대신하는 규칙선 색. */
  rule: string;
}

// 선 수와 구간 수는 화질과 비용의 절충이다. 두 겹 × 64줄 × 180구간 = 약
// 2만 3천 선분이라 스크롤 프레임마다 그려도 2D 컨텍스트가 2ms 안에 끝낸다.
const LINES = 64;
const SEGMENTS = 180;
const TAU = Math.PI * 2;

// 가장자리 몇 줄은 액센트가 아니라 규칙선 색이다. 액센트가 화면의 5%를
// 넘지 않게 하는 장치이고, 띠가 배경 격자에서 자라 나온 것처럼 읽힌다.
const RULE_EDGE = 7;

interface Layer {
  /** 마루의 x, 0~1. */
  crest: number;
  /** 봉우리 높이, h 대비. */
  amplitude: number;
  /** 띠의 기준선 y, 0~1. */
  base: number;
  /** 물결 위상. */
  phase: number;
  /** 꼬임 위상 — 띠의 폭이 뒤집히는 자리를 정한다. */
  twist: number;
  /** 기울기(라디안). */
  tilt: number;
  /** 층 전체의 밝기 배율. */
  weight: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** p∈[0,1]. 매 호출이 완전한 프레임이므로 호출자가 먼저 지운다. */
export function drawRibbon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: number,
  palette: RibbonPalette,
): void {
  // 첫 장면에서는 마루가 오른쪽(스펙 패널이 들어올 빈자리)의 중간 높이에
  // 있고, 스크럽이 진행되면 패널에 자리를 내주며 아래로 가라앉는다. 왼쪽으로
  // 옮기면 설명문 뒤를 지나가 글자를 흐린다. 위상은 한 바퀴 반을 돌아 물결이
  // 눈에 띄게 흘러가고, 꼬임은 반 바퀴 돌아 띠가 한 번 뒤집힌다.
  const front: Layer = {
    crest: lerp(0.7, 0.58, p),
    amplitude: lerp(0.14, 0.3, p),
    base: lerp(0.56, 0.78, p),
    phase: TAU * 1.5 * p,
    twist: TAU * (0.15 + 0.5 * p),
    tilt: lerp(-6, 5, p) * (Math.PI / 180),
    weight: 1,
  };

  // 뒤 겹은 앞 겹을 반 박자 늦게, 더 낮고 흐리게 따라간다. 하나만 있으면
  // 선 다발이고, 둘이 엇갈려야 깊이가 생긴다.
  const back: Layer = {
    crest: lerp(0.6, 0.72, p),
    amplitude: front.amplitude * 0.7,
    base: front.base + 0.1,
    phase: front.phase + TAU * 0.3,
    twist: front.twist + TAU * 0.35,
    tilt: -front.tilt * 0.6,
    weight: 0.4,
  };

  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  drawLayer(ctx, w, h, back, palette);
  drawLayer(ctx, w, h, front, palette);

  ctx.globalAlpha = 1;
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layer: Layer,
  palette: RibbonPalette,
): void {
  const crestX = layer.crest * w;
  const amplitude = layer.amplitude * h;
  const baseY = layer.base * h;
  const spread = amplitude * 0.9;
  const slope = Math.tan(layer.tilt);

  // 리본은 마루 근처에서만 보이고 양옆으로 사라진다. 전체 폭을 가로지르면
  // 왼쪽 열의 이름과 설명문 뒤를 지나가 글자를 흐린다.
  const accent = fadeAcross(ctx, w, crestX, palette.accent);
  const rule = fadeAcross(ctx, w, crestX, palette.rule);

  for (let i = 0; i < LINES; i += 1) {
    // -1 ~ 1. 0이 띠의 중심.
    const u = (i / (LINES - 1)) * 2 - 1;
    const offset = Math.sign(u) * u * u * spread;
    const edge = i < RULE_EDGE || i >= LINES - RULE_EDGE;

    ctx.strokeStyle = edge ? rule : accent;
    ctx.globalAlpha = lerp(0.3, 0.04, Math.abs(u)) * layer.weight;

    ctx.beginPath();
    for (let s = 0; s <= SEGMENTS; s += 1) {
      const t = s / SEGMENTS;
      const x = t * w;

      // 마루를 중심으로 한 종 모양 봉우리 둘(주봉과 뒤따르는 작은 봉우리)에
      // 짧은 파동을 얹는다. 봉우리가 리본의 형태이고 파동이 결이다.
      const d1 = (x - crestX) / (w * 0.3);
      const d2 = (x - crestX - w * 0.34) / (w * 0.18);
      const bell = Math.exp(-d1 * d1) + 0.45 * Math.exp(-d2 * d2);
      const wave =
        Math.sin(t * TAU * 1.8 + layer.phase + u * 0.9) +
        0.5 * Math.sin(t * TAU * 3.6 - layer.phase * 1.3 + u * 1.7);

      // 꼬임. 띠의 폭이 x를 따라 코사인으로 열리고 닫히며 부호가 뒤집혀,
      // 선들이 한 점에서 교차했다가 다시 벌어진다.
      const twist = Math.cos(t * TAU * 1.1 + layer.twist);

      const y =
        baseY -
        bell * amplitude * (1 + 0.22 * wave) +
        offset * twist * (0.3 + 0.7 * bell) +
        (x - w / 2) * slope;

      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

// 마루 왼쪽 0.45w에서 투명하게 시작해 마루 앞 0.14w에서 온색이 되고, 마루 뒤
// 0.3w까지 유지한 뒤 오른쪽 가장자리에서 다시 사라진다.
function fadeAcross(
  ctx: CanvasRenderingContext2D,
  w: number,
  crestX: number,
  color: string,
): CanvasGradient {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(clamp((crestX - 0.45 * w) / w), 'transparent');
  gradient.addColorStop(clamp((crestX - 0.14 * w) / w), color);
  gradient.addColorStop(clamp((crestX + 0.3 * w) / w), color);
  gradient.addColorStop(1, 'transparent');
  return gradient;
}
