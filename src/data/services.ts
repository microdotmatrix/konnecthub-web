import type { LogoKey } from './logos';

/** `platform` ships with KonnectHub. `custom` is defined once in a workspace (docs: services/custom-services). */
export type ServiceKind = 'platform' | 'custom';
export type AuthMethod = 'OAUTH2' | 'TOKEN';

export interface ServiceEntry {
  key: LogoKey;
  name: string;
  kind: ServiceKind;
  auth: readonly AuthMethod[];
  jobs: readonly string[];
}

export interface ServiceGroup {
  id: string;
  name: string;
  role: string;
  services: readonly ServiceEntry[];
}

export const SERVICE_GROUPS: readonly ServiceGroup[] = [
  {
    id: 'storefronts',
    name: 'Storefronts',
    role: 'Where orders start',
    services: [
      {
        key: 'shopify',
        name: 'Shopify',
        kind: 'platform',
        auth: ['OAUTH2'],
        jobs: ['Orders into the ERP the moment they are created', 'Product edits pushed to every feed'],
      },
      {
        key: 'bigcommerce',
        name: 'BigCommerce',
        kind: 'platform',
        auth: ['TOKEN'],
        jobs: ['Catalog and stock kept in step with the warehouse'],
      },
      {
        key: 'woocommerce',
        name: 'WooCommerce',
        kind: 'custom',
        auth: ['TOKEN'],
        jobs: ['Paid orders sent to fulfilment', 'Stock counts written back to the store'],
      },
      {
        key: 'square',
        name: 'Square',
        kind: 'custom',
        auth: ['OAUTH2'],
        jobs: ['In-store sales drawn down from the same inventory'],
      },
    ],
  },
  {
    id: 'back-office',
    name: 'Back office',
    role: 'Where orders get counted',
    services: [
      {
        key: 'zoho',
        name: 'Zoho',
        kind: 'custom',
        auth: ['OAUTH2'],
        jobs: ['Customers in CRM, invoices in Books, stock in Inventory'],
      },
      {
        key: 'quickbooks',
        name: 'QuickBooks',
        kind: 'custom',
        auth: ['OAUTH2'],
        jobs: ['Paid orders become invoices, refunds become credit notes'],
      },
      {
        key: 'hubspot',
        name: 'HubSpot',
        kind: 'custom',
        auth: ['OAUTH2', 'TOKEN'],
        jobs: ['Contacts and deals updated from order history'],
      },
      {
        key: 'airtable',
        name: 'Airtable',
        kind: 'custom',
        auth: ['TOKEN'],
        jobs: ['Ops tables the team edits, read by flows on a schedule'],
      },
    ],
  },
  {
    id: 'money-and-messages',
    name: 'Money & messages',
    role: 'Where the team hears about it',
    services: [
      {
        key: 'stripe',
        name: 'Stripe',
        kind: 'custom',
        auth: ['TOKEN'],
        jobs: ['Payouts reconciled against orders every night'],
      },
      {
        key: 'slack',
        name: 'Slack',
        kind: 'custom',
        auth: ['OAUTH2'],
        jobs: ['Approval links posted to a channel when a run pauses'],
      },
      {
        key: 'googlesheets',
        name: 'Google Sheets',
        kind: 'custom',
        auth: ['OAUTH2'],
        jobs: ['A morning report the whole team can open'],
      },
      {
        key: 'n8n',
        name: 'n8n',
        kind: 'custom',
        auth: ['TOKEN'],
        jobs: ['Workflows you already run post to a KonnectHub webhook'],
      },
    ],
  },
];

export const SERVICE_COUNT = SERVICE_GROUPS.reduce((total, group) => total + group.services.length, 0);

export interface AgentEntry {
  key: LogoKey;
  name: string;
  bin: string;
}

export const AGENTS: readonly AgentEntry[] = [
  { key: 'claude', name: 'Claude Code', bin: 'claude' },
  { key: 'openai', name: 'Codex', bin: 'codex' },
  { key: 'opencode', name: 'OpenCode', bin: 'opencode' },
  { key: 'cursor', name: 'Cursor', bin: 'cursor-agent' },
];
