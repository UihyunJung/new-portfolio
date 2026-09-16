/**
 * 히어로 배경의 신호 리본 — 헤어라인 수십 개가 꼬인 띠 두 겹을 이루고, 세
 * 입력이 띠를 민다. 스크롤 진행률이 자리·크기·꼬임을 정하고, 시간이 위상을
 * 천천히 흘려 스크롤이 없어도 살아 있게 하고, 커서가 가까운 선을 끌어당긴다.
 *
 * DOM을 모르는 순수 함수다. 같은 입력이면 같은 그림이 나오므로 리사이즈나
 * 테마 전환에서 다시 그려도 안전하고, 난수가 없어 프레임 사이에 떨림이 없다.
 * 호출자가 DPR 변환을 먼저 걸어 두면 여기서는 CSS 픽셀만 다룬다.
 */

/** sRGB 0~255. 캔버스 그라데이션 정지점에 알파를 섞어 넣어야 해서 문자열이 아니라 채널로 받는다. */
export type Rgb = readonly [number, number, number];

export interface RibbonPalette {
  /** 띠의 중심을 그리는 액센트. `--color-accent`를 sRGB로 푼 값. */
  accent: Rgb;
  /** 띠의 가장자리에서 액센트를 대신하는 규칙선 색. */
  rule: Rgb;
}

export interface RibbonState {
  /** 스크롤 진행률 0~1. */
  p: number;
  /** 경과 시간(초). 위상을 천천히 흘린다. */
  t: number;
  /** 로드 진입 0~1. 선이 왼쪽에서 오른쪽으로 그려진다. 1이면 완성. */
  reveal: number;
  /** 커서. 캔버스 기준 0~1 좌표와 영향력 0~1. 없으면 null. */
  pointer: { x: number; y: number; strength: number } | null;
}

// 선 수와 구간 수는 화질과 비용의 절충이다. 두 겹 × 64줄 × 160구간 = 약
// 2만 선분이라 매 프레임 그려도 2D 컨텍스트가 2ms 안에 끝낸다.
const LINES = 64;
const SEGMENTS = 160;
const TAU = Math.PI * 2;

// 가장자리 몇 줄은 액센트가 아니라 규칙선 색이다. 액센트가 화면의 5%를
// 넘지 않게 하는 장치이고, 띠가 배경 격자에서 자라 나온 것처럼 읽힌다.
const RULE_EDGE = 7;

// 그라데이션 정지점 수. 가로 페이드와 진입 마스크를 하나의 그라데이션으로
// 접어 넣기 위해 알파 함수를 이만큼 샘플링한다.
const STOPS = 28;

interface Layer {
  crest: number;
  amplitude: number;
  base: number;
  phase: number;
  twist: number;
  tilt: number;
  weight: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** 매 호출이 완전한 프레임이므로 호출자가 먼저 지운다. */
export function drawRibbon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: RibbonState,
  palette: RibbonPalette,
): void {
  const { p, t } = state;

  // 시간은 위상만 밀지 않는다. 마루가 좌우로 아주 조금 흔들리고 진폭이 숨을
  // 쉰다 — 스크롤이 멈춘 화면에서도 띠가 정지 화상으로 읽히지 않게. 주기는
  // 전부 다르게 잡아 같은 모양이 되돌아오지 않는다.
  const sway = 0.012 * Math.sin((t * TAU) / 9);
  const breath = 1 + 0.05 * Math.sin((t * TAU) / 6.5);
  const drift = (t * TAU) / 16;

  // 첫 장면에서는 마루가 오른쪽(스펙 패널이 들어올 빈자리)의 중간 높이에
  // 있고, 스크럽이 진행되면 패널에 자리를 내주며 아래로 가라앉는다. 왼쪽으로
  // 옮기면 설명문 뒤를 지나가 글자를 흐린다. 위상은 스크럽 동안 한 바퀴 반을
  // 돌아 물결이 눈에 띄게 흘러가고, 꼬임은 반 바퀴 돌아 띠가 한 번 뒤집힌다.
  const front: Layer = {
    crest: lerp(0.7, 0.58, p) + sway,
    amplitude: lerp(0.14, 0.3, p) * breath,
    base: lerp(0.56, 0.78, p),
    phase: TAU * 1.5 * p + drift,
    twist: TAU * (0.15 + 0.5 * p) + drift * 0.3,
    tilt: lerp(-6, 5, p) * (Math.PI / 180),
    weight: 1,
  };

  // 뒤 겹은 앞 겹을 반 박자 늦게, 더 낮고 흐리게 따라간다. 하나만 있으면
  // 선 다발이고, 둘이 엇갈려야 깊이가 생긴다.
  const back: Layer = {
    crest: lerp(0.6, 0.72, p) - sway,
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

  drawLayer(ctx, w, h, back, state, palette);
  drawLayer(ctx, w, h, front, state, palette);

  ctx.globalAlpha = 1;
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layer: Layer,
  state: RibbonState,
  palette: RibbonPalette,
): void {
  const crestX = layer.crest * w;
  const amplitude = layer.amplitude * h;
  const baseY = layer.base * h;
  const spread = amplitude * 0.9;
  const slope = Math.tan(layer.tilt);

  // 커서. 가까운 선이 커서 쪽으로 끌려온다 — 물리적으로 정확할 필요는 없고,
  // 화면이 손에 반응한다는 감각만 있으면 된다. 세로로는 커서와 선의 거리에
  // 비례하고 가로로는 종 모양으로 좁게 퍼진다.
  const pointer = state.pointer;
  const pull = pointer ? pointer.strength * 0.38 : 0;
  const px = pointer ? pointer.x * w : 0;
  const py = pointer ? pointer.y * h : 0;
  const pullWidth = w * 0.13;

  const alphaAt = fadeAndReveal(w, crestX, state.reveal);
  const accent = gradient(ctx, w, palette.accent, alphaAt);
  const rule = gradient(ctx, w, palette.rule, alphaAt);

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

      let y =
        baseY -
        bell * amplitude * (1 + 0.22 * wave) +
        offset * twist * (0.3 + 0.7 * bell) +
        (x - w / 2) * slope;

      if (pull > 0) {
        const dp = (x - px) / pullWidth;
        y += (py - y) * pull * Math.exp(-dp * dp);
      }

      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

// 가로 페이드 × 진입 마스크.
//
// 페이드: 리본은 마루 근처에서만 보이고 양옆으로 사라진다. 전체 폭을
// 가로지르면 왼쪽 열의 이름과 설명문 뒤를 지나가 글자를 흐린다. 마루 왼쪽
// 0.45w에서 투명하게 시작해 마루 앞 0.14w에서 온색이 되고, 마루 뒤 0.3w까지
// 유지한 뒤 오른쪽 가장자리에서 다시 사라진다.
//
// 진입: 선이 왼쪽에서 오른쪽으로 그려진다. 머리는 0.18w에 걸쳐 부드럽게
// 사라져서 잘린 단면이 아니라 펜 끝처럼 보인다.
function fadeAndReveal(
  w: number,
  crestX: number,
  reveal: number,
): (x: number) => number {
  const fadeIn0 = crestX - 0.45 * w;
  const fadeIn1 = crestX - 0.14 * w;
  const fadeOut0 = crestX + 0.3 * w;
  // 머리가 화면 밖(1.18w)까지 나가야 오른쪽 끝의 선도 완전히 그려진다.
  const head = reveal * w * 1.18;
  const headWidth = w * 0.18;

  return (x: number) => {
    const fade =
      x < fadeIn1
        ? clamp01((x - fadeIn0) / (fadeIn1 - fadeIn0))
        : x > fadeOut0
          ? clamp01(1 - (x - fadeOut0) / (w - fadeOut0))
          : 1;
    const drawn = clamp01((head - x) / headWidth);
    return fade * drawn;
  };
}

function gradient(
  ctx: CanvasRenderingContext2D,
  w: number,
  [r, g, b]: Rgb,
  alphaAt: (x: number) => number,
): CanvasGradient {
  const gradientFill = ctx.createLinearGradient(0, 0, w, 0);
  for (let i = 0; i <= STOPS; i += 1) {
    const t = i / STOPS;
    const a = alphaAt(t * w);
    gradientFill.addColorStop(t, `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`);
  }
  return gradientFill;
}
