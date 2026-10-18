<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { initialRuns, makeRun, pushRun, settleRun, type BoardRun } from '../../lib/runs';
  import { motionMs, visibleInterval } from '../../lib/motion';

  const VISIBLE_ROWS = 6;
  const FIRST_SEQ = 20;
  const TICK_MS = 2000;
  const SETTLE_MS = 900;
  const BASE_EVENTS = 1284;

  let runs = $state<BoardRun[]>(initialRuns(VISIBLE_ROWS, FIRST_SEQ));
  let seq = $state(FIRST_SEQ);
  let board: HTMLElement;

  const eventCount = $derived(BASE_EVENTS + (seq - FIRST_SEQ));
  const pausedCount = $derived(runs.filter((r) => r.status === 'PAUSED').length);

  function tick() {
    seq += 1;
    const run = makeRun(seq);
    runs = pushRun(runs, run, VISIBLE_ROWS);
    setTimeout(() => {
      runs = runs.map((r) => (r.id === run.id ? settleRun(r) : r));
    }, SETTLE_MS);
  }

  $effect(() => visibleInterval(board, tick, TICK_MS));

  const KIND_GLYPH = { webhook: '↘', schedule: '◷', event: '⚡︎' } as const;
</script>

<section bind:this={board} class="board machine" aria-label="Example executions board">
  <header class="board-head">
    <p class="label flex items-center gap-2 text-honey">
      <span class="live-dot" aria-hidden="true"></span>
      Executions · acme-store
    </p>
    <p class="label tabular text-haze">
      events <span class="text-paper">{eventCount.toLocaleString('en-US')}</span>
      <span class="mx-1.5 opacity-40">/</span>
      held <span class="text-paper">0</span>
      <span class="mx-1.5 opacity-40">/</span>
      paused <span class="text-paper">{pausedCount}</span>
    </p>
  </header>

  <ol class="rows">
    {#each runs as run (run.id)}
      <li
        class="row"
        animate:flip={{ duration: motionMs(520), easing: cubicOut }}
        in:fly={{ y: -18, duration: motionMs(520), easing: cubicOut }}
      >
        <span class="code tabular hidden text-haze sm:block">{run.time}</span>
        <span class="min-w-0">
          <span class="block truncate font-semibold">{run.flow}</span>
          <span class="code block truncate text-haze">
            <span aria-hidden="true" class="text-honey">{KIND_GLYPH[run.kind]}</span>
            {run.trigger}
          </span>
        </span>
        <span class="status" data-status={run.status}>{run.status.replace('_', ' ')}</span>
        <span class="code tabular hidden text-right text-haze sm:block">
          {run.status === 'RUNNING' ? '…' : `${run.durationMs} ms`}
        </span>
      </li>
    {/each}
  </ol>
</section>

<style>
  .board {
    border-radius: 18px;
    overflow: hidden;
    box-shadow:
      0 1px 0 0 oklch(100% 0 0 / 0.06) inset,
      0 40px 80px -30px oklch(19% 0.05 60 / 0.55),
      0 18px 30px -18px oklch(19% 0.05 60 / 0.5);
  }

  .board-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem 1rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-ink-3);
  }

  .live-dot {
    position: relative;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--color-honey);
  }

  .live-dot::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: inherit;
    animation: live-ping 1.8s var(--ease-out-quart) infinite;
  }

  .rows {
    position: relative;
    min-height: calc(6 * 4.25rem);
  }

  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.9rem;
    height: 4.25rem;
    padding-inline: 1rem;
    border-bottom: 1px solid oklch(32% 0.022 62 / 0.6);
  }

  .row:first-child {
    background: oklch(84.5% 0.17 82 / 0.06);
  }

  .row:last-child {
    border-bottom: 0;
  }

  @media (min-width: 640px) {
    .row {
      grid-template-columns: 5rem minmax(0, 1fr) auto 4.5rem;
      padding-inline: 1.25rem;
    }
  }

  @keyframes live-ping {
    70%,
    100% {
      transform: scale(2.8);
      opacity: 0;
    }
  }
</style>
