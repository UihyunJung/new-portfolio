/**
 * 히어로 배경의 신호 리본 — 얇은 헤어라인 수십 개가 한 띠를 이루고, 스크롤
 * 진행률이 띠의 마루 위치·진폭·기울기·위상을 민다.
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

// 선 수와 구간 수는 화질과 비용의 절충이다. 56줄 × 160구간 = 약 9천 선분이라
// 스크롤 프레임마다 그려도 2D 컨텍스트가 1ms 안에 끝낸다.
const LINES = 56;
const SEGMENTS = 160;
const TAU = Math.PI * 2;

// 가장자리 몇 줄은 액센트가 아니라 규칙선 색이다. 액센트가 화면의 5%를
// 넘지 않게 하는 장치이고, 띠가 배경 격자에서 자라 나온 것처럼 읽힌다.
const RULE_EDGE = 6;

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
  // 옮기면 설명문과 CTA 뒤를 지나가 글자를 흐린다.
  const crestX = lerp(0.72, 0.64, p) * w;
  const amplitude = lerp(0.06, 0.12, p) * h;
  const tilt = lerp(-4, 3, p) * (Math.PI / 180);
  const phase = TAU * 0.6 * p;
  const baseY = lerp(0.58, 0.8, p) * h;

  // 띠 두께. 중심으로 갈수록 촘촘해지도록 제곱 분포로 벌린다.
  const spread = amplitude * 1.1;

  // 리본은 마루 근처에서만 보이고 양옆으로 사라진다. 전체 폭을 가로지르면
  // 왼쪽 열의 이름과 설명문 뒤를 지나가 글자를 흐린다.
  const accent = fadeAcross(ctx, w, crestX, palette.accent);
  const rule = fadeAcross(ctx, w, crestX, palette.rule);

  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 0; i < LINES; i += 1) {
    // -1 ~ 1. 0이 띠의 중심.
    const u = (i / (LINES - 1)) * 2 - 1;
    const offset = Math.sign(u) * u * u * spread;
    const edge = i < RULE_EDGE || i >= LINES - RULE_EDGE;

    ctx.strokeStyle = edge ? rule : accent;
    ctx.globalAlpha = lerp(0.3, 0.04, Math.abs(u));

    ctx.beginPath();
    for (let s = 0; s <= SEGMENTS; s += 1) {
      const t = s / SEGMENTS;
      const x = t * w;
      // 마루를 중심으로 한 종 모양 봉우리에 짧은 파동을 얹는다. 봉우리가
      // 리본의 형태이고 파동이 결이다.
      const dx = (x - crestX) / (w * 0.32);
      const bell = Math.exp(-dx * dx);
      const wave =
        Math.sin(t * TAU * 1.6 + phase + u * 0.9) +
        0.5 * Math.sin(t * TAU * 3.4 - phase * 1.3 + u * 1.7);
      const y =
        baseY -
        bell * amplitude * (1 + 0.18 * wave) +
        offset * (0.35 + 0.65 * bell) +
        (x - w / 2) * Math.tan(tilt);

      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

// 마루 왼쪽 0.5w에서 투명하게 시작해 마루 앞 0.12w에서 온색이 되고, 마루 뒤
// 0.24w까지 유지한 뒤 오른쪽 가장자리에서 다시 사라진다.
function fadeAcross(
  ctx: CanvasRenderingContext2D,
  w: number,
  crestX: number,
  color: string,
): CanvasGradient {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(clamp((crestX - 0.5 * w) / w), 'transparent');
  gradient.addColorStop(clamp((crestX - 0.12 * w) / w), color);
  gradient.addColorStop(clamp((crestX + 0.24 * w) / w), color);
  gradient.addColorStop(1, 'transparent');
  return gradient;
}
