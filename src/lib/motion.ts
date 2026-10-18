const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Calls onChange whenever the node enters or leaves the viewport. Returns a cleanup function. */
export function observeVisibility(
  node: Element,
  onChange: (isVisible: boolean) => void,
  rootMargin = '80px 0px',
): () => void {
  // Use the newest record: after a long task several can be queued, oldest first.
  const observer = new IntersectionObserver(
    (entries) => {
      const latest = entries.at(-1);
      if (latest) onChange(latest.isIntersecting);
    },
    { rootMargin },
  );
  observer.observe(node);
  return () => observer.disconnect();
}

/** Svelte transitions run on the Web Animations API, so CSS cannot turn them off. */
export function motionMs(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}

/** Starts a SMIL animation as soon as it is attached. Use with {@attach}. */
export function beginNow(element: SVGAnimationElement): void {
  element.beginElement();
}

/**
 * Runs `tick` on an interval, but only while the node is visible and motion is allowed.
 * Returns a cleanup function.
 */
export function visibleInterval(node: Element, tick: () => void, intervalMs: number): () => void {
  if (prefersReducedMotion()) return () => {};

  let timer: ReturnType<typeof setInterval> | undefined;
  const stop = () => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
  };

  const disconnect = observeVisibility(node, (isVisible) => {
    if (isVisible && timer === undefined) timer = setInterval(tick, intervalMs);
    if (!isVisible) stop();
  });

  return () => {
    stop();
    disconnect();
  };
}
