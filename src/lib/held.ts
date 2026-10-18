/**
 * State for the "held deliveries" demo. Mirrors the platform rule:
 * a switched-off deployment holds deliveries; turning it back on does not replay;
 * releasing queues the backlog oldest first.
 */

export interface Delivery {
  readonly id: number;
  readonly order: string;
}

export interface HeldState {
  readonly isActive: boolean;
  readonly held: readonly Delivery[];
  readonly queue: readonly Delivery[];
  readonly done: readonly Delivery[];
  readonly nextId: number;
  readonly notice: string;
}

export type HeldAction =
  | { type: 'deliver' }
  | { type: 'toggle' }
  | { type: 'release' }
  | { type: 'finish-next' };

export const MAX_DONE = 5;
const FIRST_ORDER = 1001;

export const NOTICES = {
  on: 'Active. Each delivery runs as it arrives.',
  off: 'Switched off. New deliveries are held, not dropped.',
  released: (count: number) => `Released ${count}. Queued oldest first, same payloads.`,
  backOn: (count: number) =>
    `Back on with ${count} held. Nothing replays until you release them.`,
} as const;

/** `seeded` finished runs make the first frame look like a deployment that has been working. */
export function initialHeldState(seeded = 0): HeldState {
  const done = Array.from({ length: Math.min(seeded, MAX_DONE) }, (_, i) => newDelivery(seeded - 1 - i));
  return { isActive: true, held: [], queue: [], done, nextId: seeded, notice: NOTICES.on };
}

function newDelivery(id: number): Delivery {
  return { id, order: `A-${FIRST_ORDER + id}` };
}

export function heldReducer(state: HeldState, action: HeldAction): HeldState {
  switch (action.type) {
    case 'deliver': {
      const delivery = newDelivery(state.nextId);
      const nextId = state.nextId + 1;
      return state.isActive
        ? { ...state, nextId, queue: [...state.queue, delivery] }
        : { ...state, nextId, held: [...state.held, delivery] };
    }
    case 'toggle': {
      const isActive = !state.isActive;
      const notice = !isActive
        ? NOTICES.off
        : state.held.length > 0
          ? NOTICES.backOn(state.held.length)
          : NOTICES.on;
      return { ...state, isActive, notice };
    }
    case 'release': {
      if (state.held.length === 0) return state;
      return {
        ...state,
        queue: [...state.queue, ...state.held],
        held: [],
        notice: NOTICES.released(state.held.length),
      };
    }
    case 'finish-next': {
      if (state.queue.length === 0) return state;
      const [next, ...rest] = state.queue;
      return { ...state, queue: rest, done: [next, ...state.done].slice(0, MAX_DONE) };
    }
  }
}
