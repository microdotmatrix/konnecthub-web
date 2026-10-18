import { describe, expect, test } from 'vitest';
import { heldReducer, initialHeldState, MAX_DONE, NOTICES, type HeldState } from '../held';

const run = (state: HeldState, ...types: Parameters<typeof heldReducer>[1]['type'][]) =>
  types.reduce((s, type) => heldReducer(s, { type } as Parameters<typeof heldReducer>[1]), state);

describe('heldReducer', () => {
  test('queues deliveries while the deployment is active', () => {
    const state = run(initialHeldState(), 'deliver', 'deliver');
    expect(state.queue.map((d) => d.order)).toEqual(['A-1001', 'A-1002']);
    expect(state.held).toHaveLength(0);
  });

  test('holds deliveries instead of dropping them when switched off', () => {
    const state = run(initialHeldState(), 'toggle', 'deliver', 'deliver', 'deliver');
    expect(state.isActive).toBe(false);
    expect(state.held).toHaveLength(3);
    expect(state.queue).toHaveLength(0);
    expect(state.notice).toBe(NOTICES.off);
  });

  test('turning back on does not replay the held backlog', () => {
    const state = run(initialHeldState(), 'toggle', 'deliver', 'deliver', 'toggle');
    expect(state.isActive).toBe(true);
    expect(state.held).toHaveLength(2);
    expect(state.queue).toHaveLength(0);
    expect(state.notice).toBe(NOTICES.backOn(2));
  });

  test('release queues the backlog oldest first with the same deliveries', () => {
    const before = run(initialHeldState(), 'deliver', 'toggle', 'deliver', 'deliver', 'toggle');
    const after = heldReducer(before, { type: 'release' });
    expect(after.held).toHaveLength(0);
    expect(after.queue.map((d) => d.order)).toEqual(['A-1001', 'A-1002', 'A-1003']);
    expect(after.queue[1]).toBe(before.held[0]);
    expect(after.notice).toBe(NOTICES.released(2));
  });

  test('release with nothing held returns the same state', () => {
    const state = initialHeldState();
    expect(heldReducer(state, { type: 'release' })).toBe(state);
  });

  test('finish-next moves the oldest queued delivery to done, capped', () => {
    let state = initialHeldState();
    for (let i = 0; i < MAX_DONE + 2; i += 1) state = run(state, 'deliver', 'finish-next');
    expect(state.queue).toHaveLength(0);
    expect(state.done).toHaveLength(MAX_DONE);
    expect(state.done[0].order).toBe(`A-${1001 + MAX_DONE + 1}`);
  });

  test('seeds finished runs newest first and continues numbering', () => {
    const state = initialHeldState(3);
    expect(state.done.map((d) => d.order)).toEqual(['A-1003', 'A-1002', 'A-1001']);
    expect(heldReducer(state, { type: 'deliver' }).queue[0].order).toBe('A-1004');
  });

  test('never mutates the previous state', () => {
    const state = Object.freeze(initialHeldState());
    expect(() => run(state, 'deliver', 'toggle', 'deliver', 'release', 'finish-next')).not.toThrow();
    expect(state.queue).toHaveLength(0);
  });
});
