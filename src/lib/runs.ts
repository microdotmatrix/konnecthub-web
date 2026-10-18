/**
 * Demo data for the live executions board. Deterministic, so server and client
 * render the same first frame.
 */

export type RunStatus =
  | 'WAITING'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'WAITING_RERUN'
  | 'PAUSED'
  | 'HELD';

export type TriggerKind = 'webhook' | 'schedule' | 'event';

export interface BoardRun {
  readonly id: string;
  readonly seq: number;
  readonly flow: string;
  readonly trigger: string;
  readonly kind: TriggerKind;
  readonly time: string;
  readonly status: RunStatus;
  readonly finalStatus: RunStatus;
  readonly durationMs: number;
}

interface RunTemplate {
  readonly flow: string;
  readonly trigger: string;
  readonly kind: TriggerKind;
  readonly finalStatus: RunStatus;
}

const TEMPLATES: readonly RunTemplate[] = [
  { flow: 'order-received', trigger: 'shopify.orders.create', kind: 'event', finalStatus: 'SUCCEEDED' },
  { flow: 'sync-inventory', trigger: 'cron 0 * * * *', kind: 'schedule', finalStatus: 'SUCCEEDED' },
  { flow: 'erp-invoice', trigger: 'POST /webhooks/trigger', kind: 'webhook', finalStatus: 'SUCCEEDED' },
  { flow: 'product-to-feed', trigger: 'shopify.products.update', kind: 'event', finalStatus: 'SUCCEEDED' },
  { flow: 'crm-upsert', trigger: 'order.paid', kind: 'event', finalStatus: 'WAITING_RERUN' },
  { flow: 'order-received', trigger: 'shopify.orders.create', kind: 'event', finalStatus: 'SUCCEEDED' },
  { flow: 'refund-approval', trigger: 'POST /webhooks/trigger', kind: 'webhook', finalStatus: 'PAUSED' },
  { flow: 'nightly-report', trigger: 'cron 0 4 * * *', kind: 'schedule', finalStatus: 'SUCCEEDED' },
];

const BASE_SECONDS = 14 * 3600 + 2 * 60 + 11;
const SECONDS_PER_RUN = 2;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatClock(totalSeconds: number): string {
  const seconds = ((totalSeconds % 86400) + 86400) % 86400;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Cheap deterministic hash so durations look varied but never change between renders. */
function spread(seq: number, min: number, max: number): number {
  const x = Math.sin(seq * 12.9898) * 43758.5453;
  return Math.round(min + (x - Math.floor(x)) * (max - min));
}

export function makeRun(seq: number): BoardRun {
  const template = TEMPLATES[((seq % TEMPLATES.length) + TEMPLATES.length) % TEMPLATES.length];
  return {
    id: `exec_${(0x8f2c + seq * 37).toString(16)}`,
    seq,
    flow: template.flow,
    trigger: template.trigger,
    kind: template.kind,
    time: formatClock(BASE_SECONDS + seq * SECONDS_PER_RUN),
    status: 'RUNNING',
    finalStatus: template.finalStatus,
    durationMs: spread(seq, 24, 940),
  };
}

export function settleRun(run: BoardRun): BoardRun {
  return { ...run, status: run.finalStatus };
}

/** Newest first, trimmed to `max`. Returns a new array. */
export function pushRun(runs: readonly BoardRun[], run: BoardRun, max: number): BoardRun[] {
  return [run, ...runs].slice(0, max);
}

/** The board's first frame: `count` settled runs ending at `lastSeq`. */
export function initialRuns(count: number, lastSeq: number): BoardRun[] {
  return Array.from({ length: count }, (_, i) => settleRun(makeRun(lastSeq - i)));
}
