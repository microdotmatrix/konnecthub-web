<script lang="ts">
  import type { LoopStep } from '../../data/loop';
  import { beginNow } from '../../lib/motion';

  interface Props {
    steps: readonly LoopStep[];
    active: number;
  }

  let { steps, active }: Props = $props();

  const CENTER = 200;
  const RADIUS = 138;
  const NODE_W = 112;
  const NODE_H = 32;

  const points = $derived(
    steps.map((_, i) => {
      const angle = ((-90 + 60 * i) * Math.PI) / 180;
      return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
    }),
  );

  const edges = $derived(
    points.map((from, i) => {
      const to = points[(i + 1) % points.length];
      return { from, to, d: `M ${from.x} ${from.y} L ${to.x} ${to.y}` };
    }),
  );

  // The edge that leads into the active node carries the pulse.
  const incoming = $derived(edges[(active - 1 + edges.length) % edges.length]);

  function nodeState(i: number): 'active' | 'done' | 'next' {
    if (i === active) return 'active';
    return i < active ? 'done' : 'next';
  }
</script>

<div class="hex machine" data-live>
  <svg viewBox="0 0 400 400" role="img" aria-label={`Step ${active + 1} of ${steps.length}: ${steps[active].node}`}>
    <polygon
      points={points.map((p) => `${p.x},${p.y}`).join(' ')}
      class="hex-ring"
    />
    {#each edges as edge, i}
      <path d={edge.d} class="edge" class:lit={i < active} />
    {/each}

    <!-- SMIL, not CSS offset-path: motion along an SVG path works the same in every engine. -->
    {#key active}
      <circle r="5" class="pulse" opacity="0" data-motion="decorative">
        <animateMotion dur="1.4s" begin="indefinite" fill="freeze" path={incoming.d} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.25 1 0.5 1" {@attach beginNow} />
        <animate attributeName="opacity" dur="1.4s" begin="indefinite" fill="freeze" values="0;1;0" keyTimes="0;0.15;1" {@attach beginNow} />
      </circle>
    {/key}

    {#each points as p, i}
      <g class="node" data-state={nodeState(i)} transform={`translate(${p.x - NODE_W / 2} ${p.y - NODE_H / 2})`}>
        <rect width={NODE_W} height={NODE_H} rx="6" />
        <text x={NODE_W / 2} y={NODE_H / 2 + 4} text-anchor="middle">{steps[i].node}</text>
      </g>
    {/each}
  </svg>

  <div class="hex-center" aria-hidden="true">
    <p class="display hex-num tabular">0{active + 1}</p>
    <p class="label mt-2 text-honey">{steps[active].state}</p>
  </div>
</div>

<style>
  .hex {
    position: relative;
    aspect-ratio: 1;
    width: 100%;
    border-radius: 22px;
    background:
      radial-gradient(circle at 50% 50%, oklch(84.5% 0.17 82 / 0.1), transparent 55%),
      var(--color-ink-2);
  }

  svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .hex-ring {
    fill: none;
    stroke: var(--color-ink-3);
    stroke-width: 1;
    stroke-dasharray: 2 6;
  }

  .edge {
    fill: none;
    stroke: var(--color-ink-3);
    stroke-width: 2;
    transition: stroke var(--duration-normal) linear;
  }

  .edge.lit {
    stroke: var(--color-honey-deep);
  }

  .pulse {
    fill: var(--color-honey);
  }

  .node rect {
    fill: var(--color-ink-2);
    stroke: var(--color-ink-3);
    stroke-width: 1.5;
    transition:
      fill var(--duration-normal) linear,
      stroke var(--duration-normal) linear;
  }

  .node text {
    fill: var(--color-haze);
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .node[data-state='done'] rect {
    fill: var(--color-ink);
    stroke: var(--color-honey-deep);
  }

  .node[data-state='done'] text {
    fill: var(--color-paper);
  }

  .node[data-state='active'] rect {
    fill: var(--color-honey);
    stroke: var(--color-honey);
  }

  .node[data-state='active'] text {
    fill: var(--color-ink);
  }

  .hex-center {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    text-align: center;
    pointer-events: none;
  }

  .hex-num {
    font-size: clamp(4.5rem, 12vw, 8.5rem);
    color: var(--color-paper);
  }
</style>
