<script lang="ts">
  import { LOGOS, WORDMARK_SCALE, type LogoKey } from '../../data/logos';
  import { visibleInterval } from '../../lib/motion';

  type Kind = 'platform' | 'custom';
  interface Jack {
    key: string;
    logo: LogoKey | null;
    kind: Kind;
  }
  interface Route {
    from: string;
    to: string;
    trigger: string;
    flow: string;
    ms: number;
  }

  const COLS = 5;
  const CELL = 100;
  const HUB_INDEX = 7;
  const TICK_MS = 3400;
  const SETTLE_MS = 1500;

  // Row-major, 5 × 3. Index 7 is the hub, so the list skips it.
  const JACKS: readonly Jack[] = [
    { key: 'shopify', logo: 'shopify', kind: 'platform' },
    { key: 'bigcommerce', logo: 'bigcommerce', kind: 'platform' },
    { key: 'woocommerce', logo: 'woocommerce', kind: 'custom' },
    { key: 'square', logo: 'square', kind: 'custom' },
    { key: 'zoho', logo: 'zoho', kind: 'custom' },
    { key: 'quickbooks', logo: 'quickbooks', kind: 'custom' },
    { key: 'hubspot', logo: 'hubspot', kind: 'custom' },
    { key: 'airtable', logo: 'airtable', kind: 'custom' },
    { key: 'stripe', logo: 'stripe', kind: 'custom' },
    { key: 'slack', logo: 'slack', kind: 'custom' },
    { key: 'google-sheets', logo: 'googlesheets', kind: 'custom' },
    { key: 'n8n', logo: 'n8n', kind: 'custom' },
    { key: 'your-erp', logo: null, kind: 'custom' },
    { key: 'your-api', logo: null, kind: 'custom' },
  ];

  const ROUTES: readonly Route[] = [
    { from: 'woocommerce', to: 'zoho', trigger: 'woocommerce.order.paid', flow: 'order-to-zoho', ms: 412 },
    { from: 'shopify', to: 'quickbooks', trigger: 'shopify.orders.paid', flow: 'invoice-to-qbo', ms: 538 },
    { from: 'stripe', to: 'google-sheets', trigger: 'cron 0 6 * * *', flow: 'payout-report', ms: 1204 },
    { from: 'n8n', to: 'slack', trigger: 'POST /webhooks/trigger', flow: 'ops-alert', ms: 188 },
    { from: 'bigcommerce', to: 'your-erp', trigger: 'cron */15 * * * *', flow: 'stock-sync', ms: 731 },
    { from: 'shopify', to: 'hubspot', trigger: 'shopify.orders.create', flow: 'crm-upsert', ms: 356 },
    { from: 'square', to: 'airtable', trigger: 'square.payment.created', flow: 'pos-ledger', ms: 290 },
  ];

  /** Grid slot for a jack: the hub takes slot 7, so later jacks shift by one. */
  function slotOf(key: string): number {
    const i = JACKS.findIndex((jack) => jack.key === key);
    return i >= HUB_INDEX ? i + 1 : i;
  }

  /** Each jack's socket sits low in its cell, where a cable would plug in. */
  function socket(slot: number): { x: number; y: number } {
    return { x: (slot % COLS) * CELL + CELL / 2, y: Math.floor(slot / COLS) * CELL + 84 };
  }

  // Hub sockets sit on its side edges. The hub is opaque and drawn above the cables,
  // so a cable that crosses it reads as running behind the panel.
  const HUB_IN = { x: 200, y: 150 };
  const HUB_OUT = { x: 300, y: 150 };
  const SAG = 46;
  const FLOOR = 296;

  /** A patch cable hangs: the control point drops below the lower end. */
  function cable(a: { x: number; y: number }, b: { x: number; y: number }): string {
    const cx = (a.x + b.x) / 2;
    const cy = Math.min(Math.max(a.y, b.y) + SAG, FLOOR);
    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
  }

  let index = $state(0);
  let status = $state<'RUNNING' | 'SUCCEEDED'>('SUCCEEDED');
  let bay: HTMLElement;

  const route = $derived(ROUTES[index]);
  const inPath = $derived(cable(socket(slotOf(route.from)), HUB_IN));
  const outPath = $derived(cable(HUB_OUT, socket(slotOf(route.to))));

  const platformCount = JACKS.filter((jack) => jack.kind === 'platform').length;
  const customCount = JACKS.length - platformCount;

  function tick() {
    index = (index + 1) % ROUTES.length;
    status = 'RUNNING';
    setTimeout(() => {
      status = 'SUCCEEDED';
    }, SETTLE_MS);
  }

  $effect(() => visibleInterval(bay, tick, TICK_MS));

  const cells = [...JACKS.slice(0, HUB_INDEX), null, ...JACKS.slice(HUB_INDEX)];
</script>

<section bind:this={bay} class="bay machine" aria-label="Example patch bay: services wired through KonnectHub flows">
  <header class="bay-head">
    <p class="label flex items-center gap-2 text-honey">
      <span class="live-dot" aria-hidden="true"></span>
      Services · acme-workspace
    </p>
    <p class="label tabular text-haze">
      platform <span class="text-paper">{platformCount}</span>
      <span class="mx-1.5 opacity-40">/</span>
      custom <span class="text-paper">{customCount}</span>
    </p>
  </header>

  <div class="bay-grid">
    <svg class="cables" viewBox="0 0 500 300" aria-hidden="true">
      {#key index}
        <path class="cable" d={inPath} pathLength="1" />
        <path class="cable out" d={outPath} pathLength="1" />
        <path class="pulse" d={inPath} pathLength="1" data-motion="decorative" />
        <path class="pulse out" d={outPath} pathLength="1" data-motion="decorative" />
      {/key}
    </svg>
    <ul class="jacks">
      {#each cells as jack, slot (jack?.key ?? 'hub')}
        {#if jack}
          {@const isLive = jack.key === route.from || jack.key === route.to}
          <li class="jack" class:live={isLive} data-kind={jack.kind}>
            <span class="jack-face">
              {#if jack.logo}
                <svg viewBox="0 0 24 24" aria-hidden="true" style:scale={WORDMARK_SCALE[jack.logo]}>
                  <path fill="currentColor" d={LOGOS[jack.logo]} />
                </svg>
              {:else}
                <span class="jack-plus" aria-hidden="true">+</span>
              {/if}
            </span>
            <span class="jack-key code">{jack.key}</span>
            <span class="jack-socket" aria-hidden="true"></span>
          </li>
        {:else}
          <li class="hub" aria-label="KonnectHub flow">
            <span class="label text-haze">flow</span>
            <span class="hub-flow code">{route.flow}</span>
            <span class="status" data-status={status}>{status}</span>
            <span class="hub-socket in" aria-hidden="true"></span>
            <span class="hub-socket out" aria-hidden="true"></span>
          </li>
        {/if}
      {/each}
    </ul>

  </div>

  <footer class="bay-foot code">
    <span class="truncate">
      <span class="text-haze">{route.trigger}</span>
      <span class="text-honey" aria-hidden="true">→</span>
      <span class="font-semibold">{route.flow}</span>
      <span class="text-honey" aria-hidden="true">→</span>
      <span class="text-haze">{route.to}</span>
    </span>
    <span class="tabular text-haze">{status === 'RUNNING' ? '…' : `${route.ms} ms`}</span>
  </footer>
</section>

<style>
  .bay {
    border-radius: 18px;
    overflow: hidden;
    box-shadow:
      0 1px 0 0 oklch(100% 0 0 / 0.06) inset,
      0 40px 80px -30px oklch(19% 0.05 60 / 0.55),
      0 18px 30px -18px oklch(19% 0.05 60 / 0.5);
  }

  .bay-head,
  .bay-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 1rem;
    padding: 1rem 1.25rem;
  }

  .bay-head {
    border-bottom: 1px solid var(--color-ink-3);
  }

  .bay-foot {
    flex-wrap: nowrap;
    border-top: 1px solid var(--color-ink-3);
    background: oklch(84.5% 0.17 82 / 0.06);
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

  /* The grid and the cable overlay share one 5 × 3 coordinate space, so sockets line up. */
  .bay-grid {
    position: relative;
    aspect-ratio: 5 / 3;
  }

  .jacks {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(3, 1fr);
    height: 100%;
  }

  .jack,
  .hub {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.35rem;
    padding-top: 14%;
    border-right: 1px solid oklch(32% 0.022 62 / 0.6);
    border-bottom: 1px solid oklch(32% 0.022 62 / 0.6);
  }

  .hub {
    z-index: 1;
  }

  .jack:nth-child(5n),
  .hub:nth-child(5n) {
    border-right: 0;
  }

  .jack:nth-child(n + 11) {
    border-bottom: 0;
  }

  .jack-face {
    display: grid;
    place-items: center;
    width: clamp(1.9rem, 4.2vw, 2.6rem);
    aspect-ratio: 1;
    border-radius: 6px;
    border: 1px solid var(--color-ink-3);
    background: var(--color-ink-2);
    color: var(--color-haze);
    transition:
      color var(--duration-normal) var(--ease-out-quart),
      background-color var(--duration-normal) var(--ease-out-quart),
      border-color var(--duration-normal) var(--ease-out-quart),
      transform var(--duration-normal) var(--ease-out-expo);
  }

  .jack-face svg {
    width: 52%;
    height: 52%;
  }

  .jack[data-kind='platform'] .jack-face {
    border-color: oklch(84.5% 0.17 82 / 0.45);
  }

  .jack-plus {
    font-size: 1.25rem;
    font-weight: 300;
    line-height: 1;
  }

  .jack-key {
    max-width: 100%;
    padding-inline: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.625rem;
    line-height: 1.3;
    color: var(--color-haze);
  }

  .jack-socket {
    position: absolute;
    left: 50%;
    top: 84%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1.5px solid var(--color-ink-3);
    background: var(--color-ink);
    transform: translate(-50%, -50%);
  }

  .jack.live .jack-face {
    color: var(--color-ink);
    background: var(--color-honey);
    border-color: var(--color-honey);
    transform: translate(-2px, -2px);
    box-shadow: 2px 2px 0 0 var(--color-honey-deep);
  }

  .jack.live .jack-key {
    color: var(--color-paper);
  }

  .jack.live .jack-socket {
    border-color: var(--color-honey);
  }

  .hub {
    justify-content: center;
    padding-top: 0;
    padding-bottom: 12%;
    gap: 0.3rem;
    background: oklch(27% 0.035 66);
    outline: 1px solid var(--color-honey);
    outline-offset: -1px;
  }

  .hub-flow {
    max-width: 100%;
    padding-inline: 0.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-paper);
  }

  .cables {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }

  .cable,
  .pulse {
    fill: none;
    stroke-linecap: round;
  }

  .cable {
    stroke: var(--color-honey);
    stroke-width: 3;
    stroke-dasharray: 1;
    animation: cable-draw 0.7s var(--ease-out-expo) both;
  }

  .cable.out {
    animation-delay: 0.55s;
  }

  .pulse {
    stroke: var(--color-paper);
    stroke-width: 5;
    stroke-dasharray: 0.04 1;
    stroke-dashoffset: 0.04;
    animation: cable-pulse 0.9s var(--ease-out-quart) 0.25s both;
  }

  .pulse.out {
    animation-delay: 0.8s;
  }

  .hub-socket {
    position: absolute;
    top: 50%;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 2px solid var(--color-honey);
    background: var(--color-ink);
    transform: translate(-50%, -50%);
  }

  .hub-socket.in { left: 0; }
  .hub-socket.out { left: 100%; }

  @media (max-width: 639.98px) {
    .jack-key {
      display: none;
    }

    .hub .label,
    .hub-flow {
      display: none;
    }

    .hub .status {
      font-size: 0.5rem;
      padding-inline: 0.4em;
    }
  }

  @keyframes cable-draw {
    from {
      stroke-dashoffset: 1;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes cable-pulse {
    from {
      stroke-dashoffset: 0.04;
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    to {
      stroke-dashoffset: -1;
      opacity: 0;
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
