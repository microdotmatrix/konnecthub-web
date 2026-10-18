/**
 * Geometry for the trigger machine. Two orientations share one data model:
 * wide (sources left, deployments right) and tall (sources top, deployments bottom).
 */

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface MachineLayout {
  readonly viewBox: string;
  readonly sources: readonly Box[];
  readonly log: Box;
  readonly targets: readonly Box[];
  readonly inWire: (i: number) => string;
  readonly outWire: (i: number) => string;
  readonly compact: boolean;
}

export interface Source {
  readonly kind: string;
  readonly detail: string;
  readonly short: string;
  /** Indexes into TARGETS, with whether the binding is switched on. */
  readonly bindings: readonly { readonly target: number; readonly isOn: boolean }[];
}

export const SOURCES: readonly Source[] = [
  {
    kind: 'Webhook',
    detail: 'POST /webhooks/trigger/…',
    short: 'POST /trigger',
    bindings: [
      { target: 0, isOn: true },
      { target: 1, isOn: false },
    ],
  },
  {
    kind: 'Schedule',
    detail: '0 4 * * *  Europe/London',
    short: '0 4 * * *',
    bindings: [{ target: 0, isOn: true }],
  },
  {
    kind: 'Event source',
    detail: 'shopify.orders.create',
    short: 'orders.create',
    bindings: [
      { target: 0, isOn: true },
      { target: 2, isOn: true },
    ],
  },
];

export const TARGETS: readonly string[] = ['production', 'staging', 'eu-store'];

const curveX = (x1: number, y1: number, x2: number, y2: number) => {
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
};

const curveY = (x1: number, y1: number, x2: number, y2: number) => {
  const mid = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
};

const WIDE_ROWS = [24, 182, 340];
const wideSources = WIDE_ROWS.map((y) => ({ x: 8, y, w: 262, h: 96 }));
const wideTargets = WIDE_ROWS.map((y) => ({ x: 730, y, w: 262, h: 96 }));
const wideLog: Box = { x: 395, y: 150, w: 210, h: 160 };

export const WIDE: MachineLayout = {
  viewBox: '0 0 1000 460',
  sources: wideSources,
  targets: wideTargets,
  log: wideLog,
  compact: false,
  inWire: (i) => {
    const s = wideSources[i];
    return curveX(s.x + s.w, s.y + s.h / 2, wideLog.x, wideLog.y + wideLog.h / 2);
  },
  outWire: (i) => {
    const t = wideTargets[i];
    return curveX(wideLog.x + wideLog.w, wideLog.y + wideLog.h / 2, t.x, t.y + t.h / 2);
  },
};

const TALL_COLS = [0, 124, 248];
const tallSources = TALL_COLS.map((x) => ({ x, y: 4, w: 112, h: 84 }));
const tallTargets = TALL_COLS.map((x) => ({ x, y: 440, w: 112, h: 84 }));
const tallLog: Box = { x: 70, y: 196, w: 220, h: 132 };

export const TALL: MachineLayout = {
  viewBox: '0 0 360 528',
  sources: tallSources,
  targets: tallTargets,
  log: tallLog,
  compact: true,
  inWire: (i) => {
    const s = tallSources[i];
    return curveY(s.x + s.w / 2, s.y + s.h, tallLog.x + tallLog.w / 2, tallLog.y);
  },
  outWire: (i) => {
    const t = tallTargets[i];
    return curveY(tallLog.x + tallLog.w / 2, tallLog.y + tallLog.h, t.x + t.w / 2, t.y);
  },
};
