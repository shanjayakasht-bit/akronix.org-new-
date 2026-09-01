/* The six products actively being built. The legacy site listed twelve and
   presented all of them as purchasable, with a Request Demo button and a
   dashboard showing invented revenue. Six is the real number.
 *
 * `stage` is the only status this site publishes. "Coming soon" is accurate --
 * these are specified and being built, and none has a usable interface yet.
 *
 * Do NOT remove the stage or replace it with wording that implies a product is
 * available, and do NOT add a "Demo" control. There is nothing to demo. The
 * early-access CTA books a real conversation, which is a promise that can
 * actually be kept.
 *
 * `live` turns the marker's dot vermilion. All six are true: the work is
 * genuinely in progress, and six grey dots read as six dead rows. The stage
 * TEXT is what distinguishes a shipped product from an unfinished one -- the
 * dot says "active", not "available".
 */
export const products = [
  {
    name: 'Akronix CRM',
    code: 'CRM',
    glyph: 'Card',
    line: 'Manage leads and customers.',
    stage: 'Coming soon',
    live: true,
  },
  {
    name: 'Akronix HRMS',
    code: 'HRM',
    glyph: 'Badge',
    line: 'Simplify HR and employee management.',
    stage: 'Coming soon',
    live: true,
  },
  {
    name: 'Akronix ERP',
    code: 'ERP',
    glyph: 'Layers',
    line: 'Complete ERP solution for your business.',
    stage: 'Coming soon',
    live: true,
  },
  {
    name: 'Akronix Inventory',
    code: 'INV',
    glyph: 'Box',
    line: 'Track inventory and stock levels.',
    stage: 'Coming soon',
    live: true,
  },
  {
    name: 'Akronix POS',
    code: 'POS',
    glyph: 'Contact',
    line: 'Point of sale for retail businesses.',
    stage: 'Coming soon',
    live: true,
  },
  {
    name: 'Akronix AI Assistant',
    code: 'AI',
    glyph: 'Spark',
    line: 'A remote assistant with AI intelligence.',
    stage: 'Coming soon',
    live: true,
  },
]
