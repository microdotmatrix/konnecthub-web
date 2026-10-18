<script lang="ts">
  import LoopHex from './LoopHex.svelte';
  import { LOOP_STEPS } from '../../data/loop';

  let active = $state(0);
  let stepEls = $state<HTMLElement[]>([]);

  $effect(() => {
    // The step crossing the middle band of the viewport is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active = Number((entry.target as HTMLElement).dataset.index);
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    );
    stepEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<div class="scrolly">
  <div class="stage">
    <LoopHex steps={LOOP_STEPS} {active} />
  </div>

  <ol class="steps">
    {#each LOOP_STEPS as step, i}
      <li
        bind:this={stepEls[i]}
        data-index={i}
        class="step"
        class:is-active={i === active}
        aria-current={i === active ? 'step' : undefined}
      >
        <p class="label text-mute tabular">Step 0{i + 1} / {step.node}</p>
        <h3 class="subhead mt-3">{step.title}</h3>
        <p class="mt-4 max-w-[42ch] text-mute">{step.body}</p>
        <p class="chip code mt-6">{step.chip}</p>
      </li>
    {/each}
  </ol>
</div>

<style>
  .scrolly {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  .stage {
    position: sticky;
    top: var(--header-h);
    z-index: 2;
    padding-block: 0.75rem;
    background: var(--color-paper);
    display: flex;
    justify-content: center;
  }

  .stage :global(.hex) {
    width: min(100%, 38svh, 360px);
  }

  .step {
    min-height: 62svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Inactive steps step back by color, not opacity, so their text keeps AA contrast. */
  .step .subhead,
  .chip {
    transition:
      color var(--duration-normal) linear,
      background-color var(--duration-normal) linear;
  }

  .step:not(.is-active) .subhead {
    color: var(--color-mute);
  }

  .step:not(.is-active) .chip {
    background: var(--color-paper-2);
    color: var(--color-mute);
  }

  .step:last-child {
    min-height: 50svh;
  }

  .chip {
    align-self: flex-start;
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0.55rem 0.8rem;
    border-radius: 6px;
    background: var(--color-ink);
    color: var(--color-honey);
  }

  @media (min-width: 1024px) {
    .scrolly {
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 2.5rem;
    }

    .stage {
      grid-column: 1 / span 6;
      align-self: start;
      top: calc(var(--header-h) + 2rem);
      height: calc(100svh - var(--header-h) - 4rem);
      align-items: center;
      padding: 0;
      background: none;
    }

    .stage :global(.hex) {
      width: min(100%, calc(100svh - var(--header-h) - 6rem), 560px);
    }

    .steps {
      grid-column: 8 / span 5;
    }

    .step {
      min-height: 78svh;
    }
  }

</style>
