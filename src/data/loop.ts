export interface LoopStep {
  readonly node: string;
  readonly title: string;
  readonly body: string;
  readonly chip: string;
  readonly state: string;
}

/** The six objects of the KonnectHub loop, in the order a user meets them. */
export const LOOP_STEPS: readonly LoopStep[] = [
  {
    node: 'Flow',
    title: 'Write a flow',
    body: 'A flow is a TypeScript class. Each method is a step, and steps run top to bottom. Prefer to drag and drop? Build the same flow as nodes on a canvas.',
    chip: 'class OrderReceived extends Workflow',
    state: 'draft saved',
  },
  {
    node: 'Version',
    title: 'Publish a version',
    body: 'Publishing freezes the draft as a numbered version and bundles it in the background. It can run once the bundle is READY.',
    chip: 'v4 · bundle READY',
    state: 'v4 ready',
  },
  {
    node: 'Deployment',
    title: 'Deploy it',
    body: 'A deployment is the flow plus how it runs: which version, its inputs, its limits, and whether it is on. One flow can serve staging, production and every client you have.',
    chip: 'concurrency 1 · retries 0 · timeout 300 s',
    state: 'production on',
  },
  {
    node: 'Trigger',
    title: 'Attach a trigger',
    body: 'A webhook, a schedule or an event source. One trigger can drive four deployments. One deployment can answer to a webhook, a schedule and two event sources.',
    chip: 'POST /api/v1/webhooks/trigger/<token>',
    state: 'bound',
  },
  {
    node: 'Event',
    title: 'Every firing is an event',
    body: 'Each firing writes exactly one event, even when nothing is listening. "Three deliveries, zero runs" becomes a fact you can see, not a mystery.',
    chip: 'event #1285 · 201 Created',
    state: 'recorded',
  },
  {
    node: 'Execution',
    title: 'Read the run',
    body: 'Each event starts an execution you can open afterwards: every step with its status, its result, its timing and its logs.',
    chip: 'readOrder · SUCCEEDED · 38 ms',
    state: 'succeeded',
  },
];
