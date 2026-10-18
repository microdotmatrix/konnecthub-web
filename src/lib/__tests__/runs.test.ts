import { describe, expect, test } from 'vitest';
import { formatClock, initialRuns, makeRun, pushRun, settleRun } from '../runs';

describe('runs', () => {
  test('makeRun is deterministic and starts RUNNING', () => {
    expect(makeRun(7)).toEqual(makeRun(7));
    expect(makeRun(7).status).toBe('RUNNING');
  });

  test('settleRun applies the final status without mutating', () => {
    const run = makeRun(4);
    const settled = settleRun(run);
    expect(settled.status).toBe(run.finalStatus);
    expect(run.status).toBe('RUNNING');
  });

  test('pushRun prepends and trims', () => {
    const runs = initialRuns(3, 10);
    const next = pushRun(runs, makeRun(11), 3);
    expect(next.map((r) => r.seq)).toEqual([11, 10, 9]);
    expect(runs).toHaveLength(3);
  });

  test('formatClock wraps around midnight and handles negatives', () => {
    expect(formatClock(0)).toBe('00:00:00');
    expect(formatClock(86400 + 61)).toBe('00:01:01');
    expect(formatClock(-1)).toBe('23:59:59');
  });

  test('makeRun handles negative sequence numbers', () => {
    expect(() => makeRun(-3)).not.toThrow();
  });
});
