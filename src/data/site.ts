export const APP_URL = 'https://app.konnecthub.io';
export const DOCS_URL = `${APP_URL}/docs`;
export const CONTACT_PATH = '/contact';

// TODO: swap for the shared inquiries inbox once it exists.
export const CONTACT_EMAIL = 'hello@konnecthub.io';
export const BOOKING_ANCHOR = 'book';
export const BOOKING_URL = 'https://cannadevices-dispomart.zohobookings.com/portal-embed#/4318055000002054260';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Services', href: '/services' },
  { label: 'Docs', href: DOCS_URL, external: true },
];

export const FOOTER_NAV: readonly { heading: string; links: readonly NavLink[] }[] = [
  {
    heading: 'Platform',
    links: [
      { label: 'The loop', href: '/#platform' },
      { label: 'Triggers', href: '/#triggers' },
      { label: 'Connections', href: '/#connections' },
      { label: 'Executions', href: '/#executions' },
      { label: 'Flows', href: '/#flows' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: CONTACT_PATH },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Documentation', href: DOCS_URL, external: true },
      { label: 'Quickstart', href: `${DOCS_URL}/getting-started/quickstart`, external: true },
      { label: 'CLI reference', href: `${DOCS_URL}/cli/commands`, external: true },
      { label: 'Sign in', href: APP_URL, external: true },
    ],
  },
];
