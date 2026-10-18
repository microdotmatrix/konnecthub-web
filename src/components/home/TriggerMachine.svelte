<script lang="ts">
  import { SOURCES, TARGETS, TALL, WIDE, type MachineLayout } from './triggerLayout';
  import { beginNow, visibleInterval } from '../../lib/motion';

  const FIRE_ORDER = [0, 2, 1, 2, 0, 2];
  const FIRE_MS = 1700;
  const TRAVEL_MS = 850;
  const BASE_EVENTS = 1285;

  interface Pulse {
    id: number;
    leg: 'in' | 'out';
    index: number;
  }

  let pulses = $state<Pulse[]>([]);
  let events = $state(BASE_EVENTS);
  let lastFired = $state<number | null>(null);
  let runs = $state<number[]>([412, 37, 188]);
  let root: HTMLElement;
  let nextId = 0;
  let step = 0;

  // Wires that are permanently unwired: their binding is switched off.
  const deadTargets = TARGETS.map((_, t) =>
    SOURCES.every((s) => s.bindings.every((b) => b.target !== t || !b.isOn)),
  );

  function spawn(leg: Pulse['leg'], index: number) {
    const pulse = { id: nextId++, leg, index };
    pulses = [...pulses, pulse];
    setTimeout(() => {
      pulses = pulses.filter((p) => p.id !== pulse.id);
    }, TRAVEL_MS);
  }

  function fire() {
    const source = FIRE_ORDER[step % FIRE_ORDER.length];
    step += 1;
    spawn('in', source);

    setTimeout(() => {
      events += 1;
      lastFired = source;
      for (const binding of SOURCES[source].bindings) {
        if (!binding.isOn) continue;
        spawn('out', binding.target);
        setTimeout(() => {
          runs = runs.map((count, t) => (t === binding.target ? count + 1 : count));
        }, TRAVEL_MS);
      }
    }, TRAVEL_MS);
  }

  $effect(() => visibleInterval(root, fire, FIRE_MS));

  const LAYOUTS: readonly { name: string; layout: MachineLayout }[] = [
    { name: 'wide', layout: WIDE },
    { name: 'tall', layout: TALL },
  ];
</script>

<div bind:this={root} class="machine-scene" role="img" aria-label="Three triggers feed one event log. Every firing records one event, then runs each deployment bound to it. The webhook's binding to staging is switched off, so staging never runs, but the firing is still recorded.">
  {#each LAYOUTS as { name, layout } (name)}
    <svg viewBox={layout.viewBox} class={`scene scene-${name}`} aria-hidden="true">
      {#each SOURCES as _, i}
        <path d={layout.inWire(i)} class="wire" class:hot={lastFired === i} />
      {/each}
      {#each TARGETS as _, t}
        <path d={layout.outWire(t)} class="wire" class:dead={deadTargets[t]} />
      {/each}

      {#each pulses as pulse (pulse.id)}
        <circle r={layout.compact ? 4 : 6} class="pulse" opacity="0">
          <animateMotion
            dur={`${TRAVEL_MS}ms`}
            begin="indefinite"
            fill="freeze"
            path={pulse.leg === 'in' ? layout.inWire(pulse.index) : layout.outWire(pulse.index)}
            calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.25 1 0.5 1"
            {@attach beginNow}
          />
          <animate
            attributeName="opacity"
            dur={`${TRAVEL_MS}ms`}
            begin="indefinite"
            fill="freeze"
            values="0;1;1;0"
            keyTimes="0;0.12;0.88;1"
            {@attach beginNow}
          />
        </circle>
      {/each}

      {#each SOURCES as source, i}
        {@const box = layout.sources[i]}
        <g transform={`translate(${box.x} ${box.y})`} class="box" class:hot={lastFired === i}>
          <rect width={box.w} height={box.h} rx="8" />
          <text x={layout.compact ? 12 : 20} y={layout.compact ? 30 : 38} class="k">{source.kind}</text>
          <text x={layout.compact ? 12 : 20} y={layout.compact ? 56 : 68} class="d">
            {layout.compact ? source.short : source.detail}
          </text>
        </g>
      {/each}

      <g transform={`translate(${layout.log.x} ${layout.log.y})`} class="log">
        <rect width={layout.log.w} height={layout.log.h} rx="10" />
        <text x={layout.log.w / 2} y={layout.compact ? 34 : 42} text-anchor="middle" class="k">Events recorded</text>
        <text x={layout.log.w / 2} y={layout.compact ? 92 : 112} text-anchor="middle" class="count">
          {events.toLocaleString('en-US')}
        </text>
      </g>

      {#each TARGETS as target, t}
        {@const box = layout.targets[t]}
        <g transform={`translate(${box.x} ${box.y})`} class="box target" class:dead={deadTargets[t]}>
          <rect width={box.w} height={box.h} rx="8" />
          <text x={layout.compact ? 12 : 20} y={layout.compact ? 30 : 38} class="k">Deployment</text>
          <text x={layout.compact ? 12 : 20} y={layout.compact ? 52 : 66} class="n">{target}</text>
          <text x={layout.compact ? 12 : 20} y={layout.compact ? 72 : 86} class="d">
            {deadTargets[t] ? 'binding off' : `${runs[t]} runs`}
          </text>
        </g>
      {/each}
    </svg>
  {/each}
</div>

<style>
  .machine-scene {
    position: relative;
  }

  .scene {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .scene-wide {
    display: none;
  }

  @media (min-width: 768px) {
    .scene-wide {
      display: block;
    }

    .scene-tall {
      display: none;
    }
  }

  .wire {
    fill: none;
    stroke: var(--color-ink-3);
    stroke-width: 2;
    transition: stroke var(--duration-normal) linear;
  }

  .wire.hot {
    stroke: var(--color-honey-deep);
  }

  .wire.dead {
    stroke-dasharray: 4 6;
    opacity: 0.6;
  }

  .pulse {
    fill: var(--color-honey);
  }

  .box rect,
  .log rect {
    fill: var(--color-ink-2);
    stroke: var(--color-ink-3);
    stroke-width: 1.5;
    transition: stroke var(--duration-normal) linear;
  }

  .box.hot rect {
    stroke: var(--color-honey);
  }

  .log rect {
    fill: var(--color-ink);
    stroke: var(--color-honey-deep);
    stroke-width: 2;
  }

  .target.dead rect {
    stroke-dasharray: 4 5;
  }

  text {
    fill: var(--color-paper);
  }

  .k {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    fill: var(--color-honey);
  }

  .d {
    font-family: var(--font-mono);
    font-size: 13px;
    fill: var(--color-haze);
  }

  .n {
    font-size: 19px;
    font-weight: 700;
  }

  .count {
    font-size: 64px;
    font-weight: 900;
    font-stretch: 62%;
    font-variant-numeric: tabular-nums;
  }

  .scene-tall .k {
    font-size: 9px;
  }

  .scene-tall .d {
    font-size: 10px;
  }

  .scene-tall .n {
    font-size: 14px;
  }

  .scene-tall .count {
    font-size: 54px;
  }
</style>
