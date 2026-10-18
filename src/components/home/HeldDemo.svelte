<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { heldReducer, initialHeldState, type HeldAction } from '../../lib/held';
  import { motionMs, visibleInterval } from '../../lib/motion';

  const DELIVERY_MS = 1800;
  const WORK_MS = 650;
  const LANE_LIMIT = 5;
  const MOVE = { duration: motionMs(420), easing: cubicOut };

  let state = $state(initialHeldState(3));
  let root: HTMLElement;

  // Keyed on the head of the queue only, so new deliveries do not restart the work timer.
  const workingId = $derived(state.queue[0]?.id);
  const canRelease = $derived(state.isActive && state.held.length > 0);

  function dispatch(action: HeldAction) {
    state = heldReducer(state, action);
  }

  // Deliveries keep arriving whether or not the deployment is on. That is the point.
  $effect(() => visibleInterval(root, () => dispatch({ type: 'deliver' }), DELIVERY_MS));

  // Concurrency 1: one queued delivery finishes at a time.
  $effect(() => {
    if (workingId === undefined) return;
    const timer = setTimeout(() => dispatch({ type: 'finish-next' }), WORK_MS);
    return () => clearTimeout(timer);
  });

  function release() {
    if (canRelease) dispatch({ type: 'release' });
  }
</script>

<div bind:this={root} class="demo machine">
  <div class="demo-head">
    <div>
      <p class="label text-haze">Deployment · order-received</p>
      <p class="mt-1 text-xl font-bold">production</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={state.isActive}
      class="switch"
      onclick={() => dispatch({ type: 'toggle' })}
    >
      <span class="label" aria-hidden="true">{state.isActive ? 'On' : 'Off'}</span>
      <span class="track" aria-hidden="true"><span class="knob"></span></span>
      <span class="sr-only">Deployment active</span>
    </button>
  </div>

  <div class="lanes">
    <section class="lane" aria-label="Queue">
      <h3 class="lane-title label">Queue <span class="tabular">{state.queue.length}</span></h3>
      <ul>
        {#each state.queue.slice(0, LANE_LIMIT) as d, i (d.id)}
          <li class="chip" animate:flip={MOVE} in:fly={{ x: -24, ...MOVE }}>
            <span class="code">{d.order}</span>
            <span class="status" data-status={i === 0 ? 'RUNNING' : 'WAITING'}>{i === 0 ? 'RUNNING' : 'WAITING'}</span>
          </li>
        {/each}
      </ul>
      {#if state.queue.length > LANE_LIMIT}
        <p class="code mt-2 text-haze">+ {state.queue.length - LANE_LIMIT} more</p>
      {/if}
    </section>

    <section class="lane lane-held" class:is-holding={!state.isActive || state.held.length > 0} aria-label="Held">
      <h3 class="lane-title label">Held <span class="tabular">{state.held.length}</span></h3>
      <ul>
        {#each state.held.slice(-LANE_LIMIT) as d (d.id)}
          <li class="chip" animate:flip={MOVE} in:fly={{ y: -16, ...MOVE }}>
            <span class="code">{d.order}</span>
            <span class="status" data-status="HELD">HELD</span>
          </li>
        {/each}
      </ul>
      {#if state.held.length > LANE_LIMIT}
        <p class="code mt-2 text-haze">+ {state.held.length - LANE_LIMIT} older</p>
      {/if}
    </section>

    <section class="lane" aria-label="Finished runs">
      <h3 class="lane-title label">Runs</h3>
      <ul>
        {#each state.done as d (d.id)}
          <li class="chip" animate:flip={MOVE} in:fly={{ x: -24, ...MOVE }}>
            <span class="code">{d.order}</span>
            <span class="status" data-status="SUCCEEDED">SUCCEEDED</span>
          </li>
        {/each}
      </ul>
    </section>
  </div>

  <div class="demo-foot">
    <p class="notice" aria-live="polite">{state.notice}</p>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="btn-ghost" onclick={() => dispatch({ type: 'deliver' })}>
        Send a delivery
      </button>
      <button
        type="button"
        class="btn-release"
        aria-disabled={!canRelease}
        onclick={release}
      >
        Release {state.held.length || ''}
      </button>
    </div>
  </div>
</div>

<style>
  .demo {
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 12px 12px 0 0 var(--color-ink);
  }

  .demo-head,
  .demo-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.1rem 1.35rem;
  }

  .demo-head {
    border-bottom: 1px solid var(--color-ink-3);
  }

  .demo-foot {
    border-top: 1px solid var(--color-ink-3);
  }

  .switch {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.35rem;
    border-radius: 999px;
  }

  .track {
    position: relative;
    width: 4.25rem;
    height: 2.25rem;
    border-radius: 999px;
    background: var(--color-ok);
    transition: background-color var(--duration-normal) linear;
  }

  .knob {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: var(--color-paper);
    transform: translateX(2rem);
    transition: transform var(--duration-normal) var(--ease-out-expo);
  }

  .switch[aria-checked='false'] .track {
    background: var(--color-held);
  }

  .switch[aria-checked='false'] .knob {
    transform: translateX(0);
  }

  .lanes {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    min-height: 19rem;
  }

  .lane {
    padding: 1rem 0.85rem;
    border-right: 1px solid var(--color-ink-3);
  }

  .lane:last-child {
    border-right: 0;
  }

  .lane-held {
    transition: background-color var(--duration-normal) linear;
  }

  .lane-held.is-holding {
    background: oklch(74% 0.11 235 / 0.1);
  }

  .lane-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.85rem;
    color: var(--color-haze);
  }

  .lane ul {
    display: grid;
    gap: 0.45rem;
  }

  .chip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem;
    padding: 0.5rem 0.6rem;
    border-radius: 6px;
    background: var(--color-ink);
    border: 1px solid var(--color-ink-3);
  }

  .notice {
    flex: 1 1 18rem;
    font-weight: 600;
    color: var(--color-honey);
  }

  .btn-ghost,
  .btn-release {
    padding: 0.7rem 1rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.9375rem;
    transition:
      transform var(--duration-fast) var(--ease-out-quart),
      opacity var(--duration-fast) linear;
  }

  .btn-ghost {
    box-shadow: inset 0 0 0 1.5px var(--color-ink-3);
  }

  .btn-ghost:hover {
    box-shadow: inset 0 0 0 1.5px var(--color-haze);
  }

  .btn-release {
    background: var(--color-honey);
    color: var(--color-ink);
  }

  .btn-release:hover:not([aria-disabled='true']) {
    transform: translateY(-2px);
  }

  .btn-release[aria-disabled='true'] {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .btn-ghost:active,
  .btn-release:active:not([aria-disabled='true']) {
    transform: translateY(1px);
  }

  @media (max-width: 639.98px) {
    .lanes {
      min-height: 22rem;
    }

    .lane {
      padding: 0.85rem 0.45rem;
    }

    .chip {
      padding: 0.45rem;
    }
  }
</style>
