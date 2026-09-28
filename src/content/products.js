/* All twelve products from the live products page.
 *
 * Two stages, and the difference is the point:
 *  - "Coming soon" (`building: true`) -- the six specified and being built now.
 *  - "Planned" (`building: false`) -- the six the legacy page also listed. In
 *    Step 3 these were cut for not being in active development; the client
 *    asked for all twelve back in Step 4.3, and they return under the stage
 *    that is true of them. If one of them is being built, flip `stage` and
 *    `building` together.
 *
 * The legacy site presented all twelve as purchasable, with a Request Demo
 * button and a dashboard of invented revenue. None has shipped.
 *
 * Do NOT remove the stage or replace it with wording that implies a product is
 * available, and do NOT add a "Demo" control. There is nothing to demo. The
 * early-access CTA books a real conversation, which is a promise that can
 * actually be kept.
 *
 * `live` turns the marker's dot vermilion -- the work is genuinely in progress.
 * The stage TEXT is what distinguishes a shipped product from an unfinished
 * one; the dot says "active", not "available".
 *
 * `building` also decides the homepage grid, which shows only the six being
 * built. /building lists all twelve.
 *
 * `category` is the legacy page's own filter label.
 *
 * `summary` and `scope` feed /building. `scope` is the feature list the legacy
 * products page published, and it is shown there as what each product is
 * being BUILT to do -- labelled as planned, never as a list of things that
 * work. The summaries are written from the same lists and claim nothing
 * beyond them. Both want the client's eye before launch.
 */
export const products = [
  {
    name: 'Akronix CRM',
    category: 'CRM',
    code: 'CRM',
    glyph: 'Card',
    line: 'Manage leads and customers.',
    stage: 'Coming soon',
    live: true,
    building: true,
    summary: 'One record per customer, from the first enquiry to the repeat order, with the pipeline and support requests kept beside it.',
    scope: ['Lead management', 'Sales automation', 'Reports and analytics', 'Customer support'],
  },
  {
    name: 'Akronix HRMS',
    category: 'HR & Workforce',
    code: 'HRM',
    glyph: 'Badge',
    line: 'Simplify HR and employee management.',
    stage: 'Coming soon',
    live: true,
    building: true,
    summary: 'Employee records, attendance and leave, payroll and performance reviews, all reading from the same data.',
    scope: ['Employee management', 'Attendance and leave', 'Payroll', 'Performance tracking'],
  },
  {
    name: 'Akronix ERP',
    category: 'Operations',
    code: 'ERP',
    glyph: 'Layers',
    line: 'Complete ERP solution for your business.',
    stage: 'Coming soon',
    live: true,
    building: true,
    summary: 'Purchasing, stock, accounts and reporting as one system, so a transaction entered once shows up everywhere it matters.',
    scope: ['Procurement', 'Inventory management', 'Accounting', 'Business intelligence'],
  },
  {
    name: 'Akronix Inventory',
    category: 'Operations',
    code: 'INV',
    glyph: 'Box',
    line: 'Track inventory and stock levels.',
    stage: 'Coming soon',
    live: true,
    building: true,
    summary: 'Stock across one warehouse or several, with purchases and sales moving the counts and an alert before something runs out.',
    scope: ['Stock management', 'Warehouse management', 'Purchase and sales', 'Low-stock alerts'],
  },
  {
    name: 'Akronix POS',
    category: 'Retail',
    code: 'POS',
    glyph: 'Contact',
    line: 'Point of sale for retail businesses.',
    stage: 'Coming soon',
    live: true,
    building: true,
    summary: 'Billing at the counter and the store behind it: invoices, customers and sales figures, across more than one location.',
    scope: ['Billing and invoicing', 'Multi-store management', 'Sales analytics', 'Customer management'],
  },
  {
    name: 'Akronix AI Assistant',
    category: 'AI & Automation',
    code: 'AI',
    glyph: 'Spark',
    line: 'A remote assistant with AI intelligence.',
    stage: 'Coming soon',
    live: true,
    building: true,
    summary: 'An assistant that takes routine work off a team: answering common questions, running repeatable workflows, and reading what the data says.',
    scope: ['Smart automations', 'AI chatbot', 'Workflow automation', 'Data insights'],
  },
  {
    name: 'Akronix Attendance',
    category: 'HR & Workforce',
    code: 'ATT',
    glyph: 'Clock',
    line: 'Track attendance as it happens.',
    stage: 'Planned',
    live: false,
    building: false,
    summary: 'Attendance recorded as it happens, from biometric devices or otherwise, with shifts and reports built on the same record.',
    scope: ['Biometric integration', 'Live attendance', 'Shift management', 'Reports and analytics'],
  },
  {
    name: 'Akronix Project Management',
    category: 'Operations',
    code: 'PM',
    glyph: 'Grid',
    line: 'Plan, track and deliver projects.',
    stage: 'Planned',
    live: false,
    building: false,
    summary: 'Tasks, the people working on them and the timeline they sit on, with reports on where each project stands.',
    scope: ['Task management', 'Team collaboration', 'Timeline tracking', 'Project reports'],
  },
  {
    name: 'Akronix Books',
    category: 'Finance',
    code: 'BKS',
    glyph: 'Book',
    line: 'Bookkeeping and invoicing.',
    stage: 'Planned',
    live: false,
    building: false,
    summary: 'Bookkeeping for a small business: invoices out, expenses in, and the reports and tax filing that follow from both.',
    scope: ['Invoicing', 'Expense tracking', 'Tax filing', 'Financial reports'],
  },
  {
    name: 'Akronix E-commerce',
    category: 'Retail',
    code: 'EC',
    glyph: 'Bag',
    line: 'Run an online store.',
    stage: 'Planned',
    live: false,
    building: false,
    summary: 'An online store from catalogue to checkout: build the store, list the products, take payment and manage the orders.',
    scope: ['Store builder', 'Product catalogue', 'Order management', 'Payment gateways'],
  },
  {
    name: 'Akronix LMS',
    category: 'Education',
    code: 'LMS',
    glyph: 'Cap',
    line: 'A learning management system.',
    stage: 'Planned',
    live: false,
    building: false,
    summary: 'Courses, live classes, exams and assignments in one place, with each student’s progress tracked across them.',
    scope: ['Course management', 'Live classes', 'Exams and assignments', 'Student progress tracking'],
  },
  {
    name: 'Akronix Helpdesk',
    category: 'AI & Automation',
    code: 'HD',
    glyph: 'Chat',
    line: 'Customer support as tickets.',
    stage: 'Planned',
    live: false,
    building: false,
    summary: 'Support requests as tickets, each with a response time to meet, and a knowledge base that answers the common questions first.',
    scope: ['Ticket management', 'SLA management', 'Knowledge base', 'Customer feedback'],
  },
]

/* The in-page anchor for a product on /building: `crm`, `ai-assistant`. */
export const productSlug = (p) => p.name.replace(/^Akronix /, '').toLowerCase().replace(/\s+/g, '-')

/* The name without the house prefix, for places that list all six together. */
export const productShort = (p) => p.name.replace(/^Akronix /, '')

/* The six being built, for places that show only those -- the homepage grid. */
export const building = products.filter((p) => p.building)
export const planned = products.filter((p) => !p.building)
