import type Database from "better-sqlite3";

const REQUESTER = "Angad Singh";
const APPROVER = "Priya Shah";

export function seed(db: Database.Database) {
  const insertCompany = db.prepare(`
    INSERT INTO companies (id, name, domain, industry, hqAddress, city, state, employeeCount, mrrBand)
    VALUES (@id, @name, @domain, @industry, @hqAddress, @city, @state, @employeeCount, @mrrBand)
  `);
  const insertEvent = db.prepare(`
    INSERT INTO funding_events (id, companyId, round, amountUsd, announcedOn, leadInvestor, sourceUrl)
    VALUES (@id, @companyId, @round, @amountUsd, @announcedOn, @leadInvestor, @sourceUrl)
  `);
  const insertContact = db.prepare(`
    INSERT INTO contacts (id, companyId, fullName, title, linkedinUrl, email, isDecisionMaker)
    VALUES (@id, @companyId, @fullName, @title, @linkedinUrl, @email, @isDecisionMaker)
  `);
  const insertGift = db.prepare(`
    INSERT INTO gift_options (id, name, costUsd, description, leadTimeDays, emoji)
    VALUES (@id, @name, @costUsd, @description, @leadTimeDays, @emoji)
  `);
  const insertSend = db.prepare(`
    INSERT INTO gift_sends (
      id, contactId, companyId, giftOptionId, fundingEventId, status, note,
      requestedBy, requestedAt, decidedBy, decidedAt, rejectionReason,
      trackingNumber, shippedAt, deliveredAt, shippingAddress
    ) VALUES (
      @id, @contactId, @companyId, @giftOptionId, @fundingEventId, @status, @note,
      @requestedBy, @requestedAt, @decidedBy, @decidedAt, @rejectionReason,
      @trackingNumber, @shippedAt, @deliveredAt, @shippingAddress
    )
  `);
  const insertOutcome = db.prepare(`
    INSERT INTO outcomes (giftSendId, replied, repliedAt, meetingBooked, meetingDate, opportunityValueUsd, stage)
    VALUES (@giftSendId, @replied, @repliedAt, @meetingBooked, @meetingDate, @opportunityValueUsd, @stage)
  `);
  const insertBudget = db.prepare(`
    INSERT INTO budgets (month, allocatedUsd) VALUES (@month, @allocatedUsd)
  `);

  const companies = [
    {
      id: 1,
      name: "Northlane",
      domain: "northlane.com",
      industry: "fintech",
      hqAddress: "88 Kearny Street, Suite 1400",
      city: "San Francisco",
      state: "CA",
      employeeCount: 186,
      mrrBand: "$500k–$1M",
    },
    {
      id: 2,
      name: "Forgekit",
      domain: "forgekit.dev",
      industry: "dev tools",
      hqAddress: "600 Congress Avenue, Floor 14",
      city: "Austin",
      state: "TX",
      employeeCount: 42,
      mrrBand: "$50k–$100k",
    },
    {
      id: 3,
      name: "Cartstack",
      domain: "cartstack.io",
      industry: "ecommerce infrastructure",
      hqAddress: "335 Madison Avenue, 9th Floor",
      city: "New York",
      state: "NY",
      employeeCount: 94,
      mrrBand: "$100k–$250k",
    },
    {
      id: 4,
      name: "Stagehand",
      domain: "stagehand.app",
      industry: "creator tools",
      hqAddress: "1250 S Hope Street",
      city: "Los Angeles",
      state: "CA",
      employeeCount: 67,
      mrrBand: "$100k–$250k",
    },
    {
      id: 5,
      name: "Harborline",
      domain: "harborline.com",
      industry: "logistics",
      hqAddress: "233 S Wacker Drive, Suite 8400",
      city: "Chicago",
      state: "IL",
      employeeCount: 210,
      mrrBand: "$250k–$500k",
    },
    {
      id: 6,
      name: "Ledgerwell",
      domain: "ledgerwell.com",
      industry: "fintech",
      hqAddress: "1 World Trade Center, 84th Floor",
      city: "New York",
      state: "NY",
      employeeCount: 410,
      mrrBand: "$1M+",
    },
    {
      id: 7,
      name: "Tracegrid",
      domain: "tracegrid.io",
      industry: "dev tools",
      hqAddress: "1201 3rd Avenue, Suite 5400",
      city: "Seattle",
      state: "WA",
      employeeCount: 78,
      mrrBand: "$100k–$250k",
    },
    {
      id: 8,
      name: "Fulfillmint",
      domain: "fulfillmint.com",
      industry: "ecommerce infrastructure",
      hqAddress: "1801 California Street, Suite 2400",
      city: "Denver",
      state: "CO",
      employeeCount: 31,
      mrrBand: "$20k–$50k",
    },
    {
      id: 9,
      name: "Clipsmith",
      domain: "clipsmith.co",
      industry: "creator tools",
      hqAddress: "45 Main Street, Suite 716",
      city: "Brooklyn",
      state: "NY",
      employeeCount: 122,
      mrrBand: "$250k–$500k",
    },
    {
      id: 10,
      name: "Dockyard",
      domain: "dockyard.co",
      industry: "logistics",
      hqAddress: "1001 Brickell Bay Drive",
      city: "Miami",
      state: "FL",
      employeeCount: 55,
      mrrBand: "$50k–$100k",
    },
    {
      id: 11,
      name: "Wireframe",
      domain: "wireframe.bank",
      industry: "fintech",
      hqAddress: "535 Mission Street, 14th Floor",
      city: "San Francisco",
      state: "CA",
      employeeCount: 98,
      mrrBand: "$250k–$500k",
    },
    {
      id: 12,
      name: "Compilehaus",
      domain: "compilehaus.com",
      industry: "dev tools",
      hqAddress: "1 Lincoln Street",
      city: "Boston",
      state: "MA",
      employeeCount: 24,
      mrrBand: "$20k–$50k",
    },
    {
      id: 13,
      name: "Taxon",
      domain: "taxon.io",
      industry: "ecommerce infrastructure",
      hqAddress: "1180 Peachtree Street NE",
      city: "Atlanta",
      state: "GA",
      employeeCount: 160,
      mrrBand: "$250k–$500k",
    },
    {
      id: 14,
      name: "Floatpath",
      domain: "floatpath.com",
      industry: "fintech",
      hqAddress: "301 Howard Street, Suite 2100",
      city: "San Francisco",
      state: "CA",
      employeeCount: 38,
      mrrBand: "$50k–$100k",
    },
  ];

  const events = [
    { id: 1, companyId: 1, round: "Series B", amountUsd: 42_000_000, announcedOn: "2026-07-08", leadInvestor: "Andreessen Horowitz", sourceUrl: "https://northlane.com/blog/series-b" },
    { id: 2, companyId: 1, round: "Series A", amountUsd: 18_000_000, announcedOn: "2025-11-12", leadInvestor: "Index Ventures", sourceUrl: "https://northlane.com/blog/series-a" },
    { id: 3, companyId: 2, round: "Seed", amountUsd: 4_200_000, announcedOn: "2026-07-21", leadInvestor: "Accel", sourceUrl: "https://forgekit.dev/blog/seed" },
    { id: 4, companyId: 3, round: "Series A", amountUsd: 18_000_000, announcedOn: "2026-08-04", leadInvestor: "Bessemer Venture Partners", sourceUrl: "https://cartstack.io/journal/series-a" },
    { id: 5, companyId: 4, round: "Series A", amountUsd: 12_000_000, announcedOn: "2026-08-19", leadInvestor: "Sequoia Capital", sourceUrl: "https://stagehand.app/news/series-a" },
    { id: 6, companyId: 5, round: "Series B", amountUsd: 35_000_000, announcedOn: "2026-09-02", leadInvestor: "Tiger Global", sourceUrl: "https://harborline.com/news/series-b" },
    { id: 7, companyId: 6, round: "Series C", amountUsd: 85_000_000, announcedOn: "2026-07-14", leadInvestor: "Lightspeed Venture Partners", sourceUrl: "https://ledgerwell.com/press/series-c" },
    { id: 8, companyId: 7, round: "Series A", amountUsd: 15_000_000, announcedOn: "2026-08-11", leadInvestor: "Greylock", sourceUrl: "https://tracegrid.io/blog/series-a" },
    { id: 9, companyId: 8, round: "Seed", amountUsd: 3_500_000, announcedOn: "2026-07-02", leadInvestor: "First Round Capital", sourceUrl: "https://fulfillmint.com/seed" },
    { id: 10, companyId: 9, round: "Series B", amountUsd: 28_000_000, announcedOn: "2026-08-27", leadInvestor: "Index Ventures", sourceUrl: "https://clipsmith.co/blog/series-b" },
    { id: 11, companyId: 10, round: "Series A", amountUsd: 11_000_000, announcedOn: "2026-09-16", leadInvestor: "Benchmark", sourceUrl: "https://dockyard.co/news/series-a" },
    { id: 12, companyId: 11, round: "Series A", amountUsd: 22_000_000, announcedOn: "2026-09-22", leadInvestor: "Ribbit Capital", sourceUrl: "https://wireframe.bank/journal/series-a" },
    { id: 13, companyId: 12, round: "Seed", amountUsd: 2_800_000, announcedOn: "2026-10-01", leadInvestor: "Initialized Capital", sourceUrl: "https://compilehaus.com/seed" },
    { id: 14, companyId: 13, round: "Series B", amountUsd: 40_000_000, announcedOn: "2026-10-06", leadInvestor: "Insight Partners", sourceUrl: "https://taxon.io/press/series-b" },
    { id: 15, companyId: 14, round: "Seed", amountUsd: 6_000_000, announcedOn: "2026-10-08", leadInvestor: "Khosla Ventures", sourceUrl: "https://floatpath.com/blog/seed" },
    { id: 16, companyId: 6, round: "Series B", amountUsd: 48_000_000, announcedOn: "2025-09-30", leadInvestor: "Thrive Capital", sourceUrl: "https://ledgerwell.com/press/series-b" },
    { id: 17, companyId: 9, round: "Series A", amountUsd: 14_000_000, announcedOn: "2025-12-04", leadInvestor: "a16z", sourceUrl: "https://clipsmith.co/blog/series-a" },
    { id: 18, companyId: 5, round: "Series A", amountUsd: 16_000_000, announcedOn: "2025-10-18", leadInvestor: "GV", sourceUrl: "https://harborline.com/news/series-a" },
    { id: 19, companyId: 13, round: "Series A", amountUsd: 14_000_000, announcedOn: "2026-06-12", leadInvestor: "Bessemer Venture Partners", sourceUrl: "https://taxon.io/press/series-a" },
    { id: 20, companyId: 11, round: "Seed", amountUsd: 8_000_000, announcedOn: "2025-08-21", leadInvestor: "Founders Fund", sourceUrl: "https://wireframe.bank/journal/seed" },
  ];

  const contacts = [
    { id: 1, companyId: 1, fullName: "Maya Chen", title: "CEO", linkedinUrl: "https://linkedin.com/in/mayachen", email: "maya@northlane.com", isDecisionMaker: 1 },
    { id: 2, companyId: 1, fullName: "Owen Blake", title: "CFO", linkedinUrl: "https://linkedin.com/in/owenblake", email: "owen@northlane.com", isDecisionMaker: 0 },
    { id: 3, companyId: 1, fullName: "Priya Nair", title: "Head of Payments", linkedinUrl: "https://linkedin.com/in/priyanair", email: "priya@northlane.com", isDecisionMaker: 0 },
    { id: 4, companyId: 2, fullName: "Jonah Ellison", title: "Founder", linkedinUrl: "https://linkedin.com/in/jonahellison", email: "jonah@forgekit.dev", isDecisionMaker: 1 },
    { id: 5, companyId: 2, fullName: "Sasha Ortiz", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/sashaortiz", email: "sasha@forgekit.dev", isDecisionMaker: 0 },
    { id: 6, companyId: 3, fullName: "Elena Voss", title: "CEO", linkedinUrl: "https://linkedin.com/in/elenavoss", email: "elena@cartstack.io", isDecisionMaker: 1 },
    { id: 7, companyId: 3, fullName: "Marcus Hale", title: "VP Finance", linkedinUrl: "https://linkedin.com/in/marcushale", email: "marcus@cartstack.io", isDecisionMaker: 0 },
    { id: 8, companyId: 3, fullName: "Nina Park", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/ninapark", email: "nina@cartstack.io", isDecisionMaker: 0 },
    { id: 9, companyId: 4, fullName: "Devon Ruiz", title: "Founder", linkedinUrl: "https://linkedin.com/in/devonruiz", email: "devon@stagehand.app", isDecisionMaker: 1 },
    { id: 10, companyId: 4, fullName: "Alicia Cho", title: "CFO", linkedinUrl: "https://linkedin.com/in/aliciacho", email: "alicia@stagehand.app", isDecisionMaker: 0 },
    { id: 11, companyId: 5, fullName: "Tomás Rivera", title: "CEO", linkedinUrl: "https://linkedin.com/in/tomasrivera", email: "tomas@harborline.com", isDecisionMaker: 1 },
    { id: 12, companyId: 5, fullName: "Hannah Briggs", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/hannahbriggs", email: "hannah@harborline.com", isDecisionMaker: 0 },
    { id: 13, companyId: 5, fullName: "Chris Adelman", title: "VP Finance", linkedinUrl: "https://linkedin.com/in/chrisadelman", email: "chris@harborline.com", isDecisionMaker: 0 },
    { id: 14, companyId: 6, fullName: "Amelia Ford", title: "CEO", linkedinUrl: "https://linkedin.com/in/ameliaford", email: "amelia@ledgerwell.com", isDecisionMaker: 1 },
    { id: 15, companyId: 6, fullName: "Rahul Mehta", title: "CFO", linkedinUrl: "https://linkedin.com/in/rahulmehta", email: "rahul@ledgerwell.com", isDecisionMaker: 0 },
    { id: 16, companyId: 6, fullName: "Kate Lindholm", title: "Head of Payments", linkedinUrl: "https://linkedin.com/in/katelindholm", email: "kate@ledgerwell.com", isDecisionMaker: 0 },
    { id: 17, companyId: 6, fullName: "Ben Ivers", title: "VP Finance", linkedinUrl: "https://linkedin.com/in/benivers", email: "ben@ledgerwell.com", isDecisionMaker: 0 },
    { id: 18, companyId: 7, fullName: "Leah Kim", title: "Founder", linkedinUrl: "https://linkedin.com/in/leahkim", email: "leah@tracegrid.io", isDecisionMaker: 1 },
    { id: 19, companyId: 7, fullName: "Patrick Shaw", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/patrickshaw", email: "patrick@tracegrid.io", isDecisionMaker: 0 },
    { id: 20, companyId: 8, fullName: "Ivy Moreau", title: "CEO", linkedinUrl: "https://linkedin.com/in/ivymoreau", email: "ivy@fulfillmint.com", isDecisionMaker: 1 },
    { id: 21, companyId: 8, fullName: "Greg Anton", title: "Founder", linkedinUrl: "https://linkedin.com/in/greganton", email: "greg@fulfillmint.com", isDecisionMaker: 0 },
    { id: 22, companyId: 9, fullName: "Nora Patel", title: "CEO", linkedinUrl: "https://linkedin.com/in/norapatel", email: "nora@clipsmith.co", isDecisionMaker: 1 },
    { id: 23, companyId: 9, fullName: "Sam Whitaker", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/samwhitaker", email: "sam@clipsmith.co", isDecisionMaker: 0 },
    { id: 24, companyId: 9, fullName: "Jules Romero", title: "CFO", linkedinUrl: "https://linkedin.com/in/julesromero", email: "jules@clipsmith.co", isDecisionMaker: 0 },
    { id: 25, companyId: 10, fullName: "Diego Vega", title: "CEO", linkedinUrl: "https://linkedin.com/in/diegovega", email: "diego@dockyard.co", isDecisionMaker: 1 },
    { id: 26, companyId: 10, fullName: "Maren Cole", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/marencole", email: "maren@dockyard.co", isDecisionMaker: 0 },
    { id: 27, companyId: 11, fullName: "Sophie Grant", title: "CEO", linkedinUrl: "https://linkedin.com/in/sophiegrant", email: "sophie@wireframe.bank", isDecisionMaker: 1 },
    { id: 28, companyId: 11, fullName: "Theo Marsh", title: "Head of Payments", linkedinUrl: "https://linkedin.com/in/theomarsh", email: "theo@wireframe.bank", isDecisionMaker: 0 },
    { id: 29, companyId: 11, fullName: "Lina Okonkwo", title: "CFO", linkedinUrl: "https://linkedin.com/in/linaokonkwo", email: "lina@wireframe.bank", isDecisionMaker: 0 },
    { id: 30, companyId: 12, fullName: "Evan Brooks", title: "Founder", linkedinUrl: "https://linkedin.com/in/evanbrooks", email: "evan@compilehaus.com", isDecisionMaker: 1 },
    { id: 31, companyId: 12, fullName: "Rita Solano", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/ritasolano", email: "rita@compilehaus.com", isDecisionMaker: 0 },
    { id: 32, companyId: 13, fullName: "Claire Huang", title: "CEO", linkedinUrl: "https://linkedin.com/in/clairehuang", email: "claire@taxon.io", isDecisionMaker: 1 },
    { id: 33, companyId: 13, fullName: "Adam Farrow", title: "VP Finance", linkedinUrl: "https://linkedin.com/in/adamfarrow", email: "adam@taxon.io", isDecisionMaker: 0 },
    { id: 34, companyId: 13, fullName: "Yara Singh", title: "Head of Ops", linkedinUrl: "https://linkedin.com/in/yarasingh", email: "yara@taxon.io", isDecisionMaker: 0 },
    { id: 35, companyId: 14, fullName: "Nate Holloway", title: "Founder", linkedinUrl: "https://linkedin.com/in/nateholloway", email: "nate@floatpath.com", isDecisionMaker: 1 },
    { id: 36, companyId: 14, fullName: "Gwen Adler", title: "CFO", linkedinUrl: "https://linkedin.com/in/gwenadler", email: "gwen@floatpath.com", isDecisionMaker: 0 },
  ];

  const gifts = [
    { id: 1, name: "Cookie box", costUsd: 45, description: "Assorted bakery tin. Lands well, rarely returned.", leadTimeDays: 3, emoji: "🍪" },
    { id: 2, name: "Premium coffee set", costUsd: 70, description: "Single-origin beans, pour-over cone, and two mugs.", leadTimeDays: 4, emoji: "☕" },
    { id: 3, name: "Branded merch box", costUsd: 120, description: "Hoodie, notebook, and a tasteful tote. Heavy ship.", leadTimeDays: 8, emoji: "📦" },
    { id: 4, name: "Desk plant", costUsd: 55, description: "Potted olive or snake plant, delivered to HQ.", leadTimeDays: 5, emoji: "🌿" },
    { id: 5, name: "Steak dinner gift card", costUsd: 200, description: "Two-person dinner at a city steakhouse.", leadTimeDays: 1, emoji: "🥩" },
    { id: 6, name: "Handwritten note and candle", costUsd: 35, description: "Letterpress card plus a small soy candle.", leadTimeDays: 6, emoji: "🕯️" },
  ];

  const addr = (id: number) => {
    const c = companies.find((x) => x.id === id)!;
    return `${c.hqAddress}, ${c.city}, ${c.state}`;
  };

  const sends = [
    // 16 delivered
    {
      id: 1, contactId: 1, companyId: 1, giftOptionId: 1, fundingEventId: 1, status: "delivered",
      note: "Maya, a $42M Series B led by Andreessen Horowitz is a different kind of problem set for Northlane. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-07-09T14:12:00.000Z", decidedBy: APPROVER, decidedAt: "2026-07-09T18:40:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456001", shippedAt: "2026-07-11T16:00:00.000Z", deliveredAt: "2026-07-14T19:20:00.000Z",
      shippingAddress: addr(1),
    },
    {
      id: 2, contactId: 4, companyId: 2, giftOptionId: 1, fundingEventId: 3, status: "delivered",
      note: "Jonah — congratulations on the Seed round. Raising $4.2M with Accel behind you is a strong start for Forgekit. Sending a small something to the office; if it's useful to compare notes as you staff up GTM, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-07-22T11:05:00.000Z", decidedBy: APPROVER, decidedAt: "2026-07-22T15:10:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456002", shippedAt: "2026-07-24T15:00:00.000Z", deliveredAt: "2026-07-28T17:40:00.000Z",
      shippingAddress: addr(2),
    },
    {
      id: 3, contactId: 6, companyId: 3, giftOptionId: 1, fundingEventId: 4, status: "delivered",
      note: "Congrats on the Series A, Elena. Closing $18M with Bessemer Venture Partners leading is a real milestone for Cartstack. Enjoy the cookies, and if it's ever useful to compare notes on scaling ecommerce infrastructure as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-08-05T13:22:00.000Z", decidedBy: APPROVER, decidedAt: "2026-08-05T16:50:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456003", shippedAt: "2026-08-07T14:00:00.000Z", deliveredAt: "2026-08-11T18:15:00.000Z",
      shippingAddress: addr(3),
    },
    {
      id: 4, contactId: 9, companyId: 4, giftOptionId: 1, fundingEventId: 5, status: "delivered",
      note: "Congrats on the Series A, Devon. Closing $12M with Sequoia Capital leading is a real milestone for Stagehand. Enjoy the cookies, and if it's ever useful to compare notes on scaling creator tools as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-08-20T10:18:00.000Z", decidedBy: APPROVER, decidedAt: "2026-08-20T12:02:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456004", shippedAt: "2026-08-22T15:30:00.000Z", deliveredAt: "2026-08-26T16:00:00.000Z",
      shippingAddress: addr(4),
    },
    {
      id: 5, contactId: 11, companyId: 5, giftOptionId: 1, fundingEventId: 6, status: "delivered",
      note: "Tomás, a $35M Series B led by Tiger Global is a different kind of problem set for Harborline. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-09-03T09:40:00.000Z", decidedBy: APPROVER, decidedAt: "2026-09-03T14:11:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456005", shippedAt: "2026-09-05T13:00:00.000Z", deliveredAt: "2026-09-09T15:45:00.000Z",
      shippingAddress: addr(5),
    },
    {
      id: 6, contactId: 14, companyId: 6, giftOptionId: 2, fundingEventId: 7, status: "delivered",
      note: "Amelia — a $85M Series C led by Lightspeed Venture Partners is the kind of round the whole fintech stack notices. A small congratulations for the Ledgerwell team. If a conversation would ever help, I'm easy to find.",
      requestedBy: REQUESTER, requestedAt: "2026-07-15T16:08:00.000Z", decidedBy: APPROVER, decidedAt: "2026-07-16T10:22:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456006", shippedAt: "2026-07-18T12:00:00.000Z", deliveredAt: "2026-07-22T14:30:00.000Z",
      shippingAddress: addr(6),
    },
    {
      id: 7, contactId: 18, companyId: 7, giftOptionId: 2, fundingEventId: 8, status: "delivered",
      note: "Congrats on the Series A, Leah. Closing $15M with Greylock leading is a real milestone for Tracegrid. Enjoy the cookies, and if it's ever useful to compare notes on scaling dev tools as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-08-12T11:44:00.000Z", decidedBy: APPROVER, decidedAt: "2026-08-12T17:05:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456007", shippedAt: "2026-08-14T16:20:00.000Z", deliveredAt: "2026-08-18T19:00:00.000Z",
      shippingAddress: addr(7),
    },
    {
      id: 8, contactId: 22, companyId: 9, giftOptionId: 2, fundingEventId: 10, status: "delivered",
      note: "Nora, a $28M Series B led by Index Ventures is a different kind of problem set for Clipsmith. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-08-28T14:55:00.000Z", decidedBy: APPROVER, decidedAt: "2026-08-29T09:18:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456008", shippedAt: "2026-08-31T11:00:00.000Z", deliveredAt: "2026-09-04T13:40:00.000Z",
      shippingAddress: addr(9),
    },
    {
      id: 9, contactId: 27, companyId: 11, giftOptionId: 2, fundingEventId: 12, status: "delivered",
      note: "Congrats on the Series A, Sophie. Closing $22M with Ribbit Capital leading is a real milestone for Wireframe. Enjoy the cookies, and if it's ever useful to compare notes on scaling fintech as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-09-23T10:02:00.000Z", decidedBy: APPROVER, decidedAt: "2026-09-23T15:36:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456009", shippedAt: "2026-09-25T12:15:00.000Z", deliveredAt: "2026-09-29T16:50:00.000Z",
      shippingAddress: addr(11),
    },
    {
      id: 10, contactId: 20, companyId: 8, giftOptionId: 4, fundingEventId: 9, status: "delivered",
      note: "Ivy — congratulations on the Seed round. Raising $3.5M with First Round Capital behind you is a strong start for Fulfillmint. Sending a small something to the office; if it's useful to compare notes as you staff up GTM, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-07-03T09:12:00.000Z", decidedBy: APPROVER, decidedAt: "2026-07-03T13:47:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456010", shippedAt: "2026-07-06T15:00:00.000Z", deliveredAt: "2026-07-10T18:00:00.000Z",
      shippingAddress: addr(8),
    },
    {
      id: 11, contactId: 12, companyId: 5, giftOptionId: 4, fundingEventId: 6, status: "delivered",
      note: "Hannah, a $35M Series B led by Tiger Global is a different kind of problem set for Harborline. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-09-04T15:28:00.000Z", decidedBy: APPROVER, decidedAt: "2026-09-05T11:09:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456011", shippedAt: "2026-09-08T10:40:00.000Z", deliveredAt: "2026-09-12T14:22:00.000Z",
      shippingAddress: addr(5),
    },
    {
      id: 12, contactId: 19, companyId: 7, giftOptionId: 4, fundingEventId: 8, status: "delivered",
      note: "Patrick — saw Tracegrid's Series A with Greylock at $15M. Congratulations to you and the team. Sending something over; would welcome a conversation if the timing is right.",
      requestedBy: REQUESTER, requestedAt: "2026-08-13T16:41:00.000Z", decidedBy: APPROVER, decidedAt: "2026-08-14T09:55:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456012", shippedAt: "2026-08-17T13:10:00.000Z", deliveredAt: "2026-08-21T15:00:00.000Z",
      shippingAddress: addr(7),
    },
    {
      id: 13, contactId: 15, companyId: 6, giftOptionId: 3, fundingEventId: 7, status: "delivered",
      note: "Rahul — a $85M Series C led by Lightspeed Venture Partners is the kind of round the whole fintech stack notices. A small congratulations for the Ledgerwell team. If a conversation would ever help, I'm easy to find.",
      requestedBy: REQUESTER, requestedAt: "2026-07-17T12:33:00.000Z", decidedBy: APPROVER, decidedAt: "2026-07-17T18:01:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456013", shippedAt: "2026-07-24T11:00:00.000Z", deliveredAt: "2026-08-01T16:45:00.000Z",
      shippingAddress: addr(6),
    },
    {
      id: 14, contactId: 10, companyId: 4, giftOptionId: 3, fundingEventId: 5, status: "delivered",
      note: "Congrats on the Series A, Alicia. Closing $12M with Sequoia Capital leading is a real milestone for Stagehand. Enjoy the cookies, and if it's ever useful to compare notes on scaling creator tools as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-09-26T10:16:00.000Z", decidedBy: APPROVER, decidedAt: "2026-09-26T14:44:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456014", shippedAt: "2026-09-29T12:00:00.000Z", deliveredAt: "2026-10-03T17:20:00.000Z",
      shippingAddress: addr(4),
    },
    {
      id: 15, contactId: 24, companyId: 9, giftOptionId: 5, fundingEventId: 10, status: "delivered",
      note: "Jules, a $28M Series B led by Index Ventures is a different kind of problem set for Clipsmith. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-08-28T15:40:00.000Z", decidedBy: APPROVER, decidedAt: "2026-08-29T10:05:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456015", shippedAt: "2026-08-30T09:00:00.000Z", deliveredAt: "2026-09-02T13:10:00.000Z",
      shippingAddress: addr(9),
    },
    {
      id: 16, contactId: 28, companyId: 11, giftOptionId: 6, fundingEventId: 12, status: "delivered",
      note: "Congrats on the Series A, Theo. Closing $22M with Ribbit Capital leading is a real milestone for Wireframe. Enjoy the cookies, and if it's ever useful to compare notes on scaling fintech as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-09-24T08:51:00.000Z", decidedBy: APPROVER, decidedAt: "2026-09-24T12:19:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456016", shippedAt: "2026-09-28T14:00:00.000Z", deliveredAt: "2026-10-04T15:35:00.000Z",
      shippingAddress: addr(11),
    },
    // 3 shipped
    {
      id: 17, contactId: 25, companyId: 10, giftOptionId: 2, fundingEventId: 11, status: "shipped",
      note: "Congrats on the Series A, Diego. Closing $11M with Benchmark leading is a real milestone for Dockyard. Enjoy the cookies, and if it's ever useful to compare notes on scaling logistics as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-09-17T11:27:00.000Z", decidedBy: APPROVER, decidedAt: "2026-09-17T16:03:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456017", shippedAt: "2026-10-07T13:20:00.000Z", deliveredAt: null,
      shippingAddress: addr(10),
    },
    {
      id: 18, contactId: 7, companyId: 3, giftOptionId: 6, fundingEventId: 4, status: "shipped",
      note: "Congrats on the Series A, Marcus. Closing $18M with Bessemer Venture Partners leading is a real milestone for Cartstack. Enjoy the cookies, and if it's ever useful to compare notes on scaling ecommerce infrastructure as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-09-30T14:08:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-01T09:41:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456018", shippedAt: "2026-10-06T10:15:00.000Z", deliveredAt: null,
      shippingAddress: addr(3),
    },
    {
      id: 19, contactId: 3, companyId: 1, giftOptionId: 2, fundingEventId: 1, status: "shipped",
      note: "Priya, a $42M Series B led by Andreessen Horowitz is a different kind of problem set for Northlane. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-09-29T12:00:00.000Z", decidedBy: APPROVER, decidedAt: "2026-09-29T17:22:00.000Z",
      rejectionReason: null, trackingNumber: "1Z999AA10123456019", shippedAt: "2026-10-08T11:45:00.000Z", deliveredAt: null,
      shippingAddress: addr(1),
    },
    // 3 approved (committed against Oct)
    {
      id: 20, contactId: 32, companyId: 13, giftOptionId: 1, fundingEventId: 14, status: "approved",
      note: "Claire, a $40M Series B led by Insight Partners is a different kind of problem set for Taxon. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-10-07T09:14:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-07T15:50:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(13),
    },
    {
      id: 21, contactId: 35, companyId: 14, giftOptionId: 4, fundingEventId: 15, status: "approved",
      note: "Nate — congratulations on the Seed round. Raising $6M with Khosla Ventures behind you is a strong start for Floatpath. Sending a small something to the office; if it's useful to compare notes as you staff up GTM, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-10-08T16:22:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-09T10:07:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(14),
    },
    {
      id: 22, contactId: 30, companyId: 12, giftOptionId: 2, fundingEventId: 13, status: "approved",
      note: "Evan — congratulations on the Seed round. Raising $2.8M with Initialized Capital behind you is a strong start for Compilehaus. Sending a small something to the office; if it's useful to compare notes as you staff up GTM, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-10-02T13:39:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-02T18:16:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(12),
    },
    // 4 pending
    {
      id: 23, contactId: 33, companyId: 13, giftOptionId: 5, fundingEventId: 14, status: "pending",
      note: "Adam, a $40M Series B led by Insight Partners is a different kind of problem set for Taxon. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-10-09T11:05:00.000Z", decidedBy: null, decidedAt: null,
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(13),
    },
    {
      id: 24, contactId: 36, companyId: 14, giftOptionId: 3, fundingEventId: 15, status: "pending",
      note: "Gwen — congratulations on the Seed round. Raising $6M with Khosla Ventures behind you is a strong start for Floatpath. Sending a small something to the office; if it's useful to compare notes as you staff up GTM, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-10-10T08:47:00.000Z", decidedBy: null, decidedAt: null,
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(14),
    },
    {
      id: 25, contactId: 31, companyId: 12, giftOptionId: 1, fundingEventId: 13, status: "pending",
      note: "Rita — congratulations on the Seed round. Raising $2.8M with Initialized Capital behind you is a strong start for Compilehaus. Sending a small something to the office; if it's useful to compare notes as you staff up GTM, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-10-03T15:12:00.000Z", decidedBy: null, decidedAt: null,
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(12),
    },
    {
      id: 26, contactId: 26, companyId: 10, giftOptionId: 1, fundingEventId: 11, status: "pending",
      note: "Congrats on the Series A, Maren. Closing $11M with Benchmark leading is a real milestone for Dockyard. Enjoy the cookies, and if it's ever useful to compare notes on scaling logistics as you grow, I'm around.",
      requestedBy: REQUESTER, requestedAt: "2026-10-08T14:33:00.000Z", decidedBy: null, decidedAt: null,
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(10),
    },
    // 2 rejected
    {
      id: 27, contactId: 17, companyId: 6, giftOptionId: 5, fundingEventId: 7, status: "rejected",
      note: "Ben — a $85M Series C led by Lightspeed Venture Partners is the kind of round the whole fintech stack notices. A small congratulations for the Ledgerwell team. If a conversation would ever help, I'm easy to find.",
      requestedBy: REQUESTER, requestedAt: "2026-07-18T09:20:00.000Z", decidedBy: APPROVER, decidedAt: "2026-07-18T11:44:00.000Z",
      rejectionReason: "Steak cards are overkill for a second gift into the same account this month.", trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(6),
    },
    {
      id: 28, contactId: 23, companyId: 9, giftOptionId: 3, fundingEventId: 10, status: "rejected",
      note: "Sam, a $28M Series B led by Index Ventures is a different kind of problem set for Clipsmith. Hope this lands at a good moment between hiring spikes. Happy to swap notes on what actually breaks after the raise.",
      requestedBy: REQUESTER, requestedAt: "2026-08-30T12:16:00.000Z", decidedBy: APPROVER, decidedAt: "2026-08-30T16:02:00.000Z",
      rejectionReason: "Already sending coffee to the CEO. Skip merch until we see a reply.", trackingNumber: null, shippedAt: null, deliveredAt: null,
      shippingAddress: addr(9),
    },
    // Extra October approved sends so the month sits ~$80 under budget.
    // Approving the pending steak ($200) or merch ($120) trips the warning; cookies do not.
    {
      id: 29, contactId: 2, companyId: 1, giftOptionId: 3, fundingEventId: 1, status: "approved",
      note: "Owen, a $42M Series B led by Andreessen Horowitz is a different kind of problem set for Northlane. A merch box for the finance team while the round closes.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-01T09:10:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-01T11:20:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(1),
    },
    {
      id: 30, contactId: 8, companyId: 3, giftOptionId: 3, fundingEventId: 4, status: "approved",
      note: "Nina — congratulations on Cartstack's Series A with Bessemer. Merch for the ops pod.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-01T13:40:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-01T16:05:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(3),
    },
    {
      id: 31, contactId: 13, companyId: 5, giftOptionId: 5, fundingEventId: 6, status: "approved",
      note: "Chris, a $35M Series B led by Tiger Global is a different kind of problem set for Harborline. Dinner is on us.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-02T10:12:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-02T12:48:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(5),
    },
    {
      id: 32, contactId: 16, companyId: 6, giftOptionId: 5, fundingEventId: 7, status: "approved",
      note: "Kate — a $85M Series C led by Lightspeed. Steak dinner for the payments team.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-03T09:22:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-03T11:01:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(6),
    },
    {
      id: 33, contactId: 21, companyId: 8, giftOptionId: 3, fundingEventId: 9, status: "approved",
      note: "Greg — congratulations on the Seed round with First Round. Merch box inbound.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-03T14:55:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-03T17:18:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(8),
    },
    {
      id: 34, contactId: 5, companyId: 2, giftOptionId: 5, fundingEventId: 3, status: "approved",
      note: "Sasha — congratulations on Forgekit's Seed with Accel. Dinner credit while you hire.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-05T08:40:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-05T10:12:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(2),
    },
    {
      id: 35, contactId: 29, companyId: 11, giftOptionId: 3, fundingEventId: 12, status: "approved",
      note: "Congrats on the Series A, Lina. Closing $22M with Ribbit. Merch for finance.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-05T15:03:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-05T18:27:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(11),
    },
    {
      id: 36, contactId: 34, companyId: 13, giftOptionId: 5, fundingEventId: 14, status: "approved",
      note: "Yara, a $40M Series B led by Insight Partners. Dinner for the ops lead.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-06T09:18:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-06T11:44:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(13),
    },
    {
      id: 37, contactId: 7, companyId: 3, giftOptionId: 5, fundingEventId: 4, status: "approved",
      note: "Marcus — Cartstack Series A with Bessemer. A dinner while you close Q4 planning.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-06T13:29:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-06T16:02:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(3),
    },
    {
      id: 38, contactId: 18, companyId: 7, giftOptionId: 3, fundingEventId: 8, status: "approved",
      note: "Leah — Tracegrid Series A with Greylock. Merch box for the founding team.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-07T10:50:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-07T12:15:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(7),
    },
    {
      id: 39, contactId: 22, companyId: 9, giftOptionId: 5, fundingEventId: 10, status: "approved",
      note: "Nora, a $28M Series B led by Index. Dinner for the CEO after the announcement week.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-07T14:11:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-07T16:40:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(9),
    },
    {
      id: 40, contactId: 25, companyId: 10, giftOptionId: 3, fundingEventId: 11, status: "approved",
      note: "Diego — Dockyard Series A with Benchmark. Merch for HQ.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-08T09:05:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-08T11:33:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(10),
    },
    {
      id: 41, contactId: 36, companyId: 14, giftOptionId: 3, fundingEventId: 15, status: "approved",
      note: "Gwen — Floatpath Seed with Khosla. Merch for the founding finance hire.",
      requestedBy: "Jordan Hale", requestedAt: "2026-10-08T12:44:00.000Z", decidedBy: APPROVER, decidedAt: "2026-10-08T15:09:00.000Z",
      rejectionReason: null, trackingNumber: null, shippedAt: null, deliveredAt: null, shippingAddress: addr(14),
    },
  ];

  const outcomes = [
    { giftSendId: 1, replied: 1, repliedAt: "2026-07-16T15:00:00.000Z", meetingBooked: 1, meetingDate: "2026-07-24", opportunityValueUsd: 48_000, stage: "qualified" },
    { giftSendId: 2, replied: 1, repliedAt: "2026-07-30T18:12:00.000Z", meetingBooked: 1, meetingDate: "2026-08-06", opportunityValueUsd: 92_000, stage: "closed_won" },
    { giftSendId: 3, replied: 1, repliedAt: "2026-08-13T14:40:00.000Z", meetingBooked: 1, meetingDate: "2026-08-21", opportunityValueUsd: 18_000, stage: "meeting_booked" },
    { giftSendId: 4, replied: 0, repliedAt: null, meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 5, replied: 0, repliedAt: null, meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 6, replied: 1, repliedAt: "2026-07-25T11:08:00.000Z", meetingBooked: 1, meetingDate: "2026-08-04", opportunityValueUsd: 160_000, stage: "closed_won" },
    { giftSendId: 7, replied: 1, repliedAt: "2026-08-22T09:33:00.000Z", meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 8, replied: 0, repliedAt: null, meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 9, replied: 0, repliedAt: null, meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 10, replied: 1, repliedAt: "2026-07-14T16:21:00.000Z", meetingBooked: 1, meetingDate: "2026-07-22", opportunityValueUsd: 25_000, stage: "meeting_booked" },
    { giftSendId: 11, replied: 1, repliedAt: "2026-09-16T13:05:00.000Z", meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 12, replied: 0, repliedAt: null, meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 13, replied: 1, repliedAt: "2026-08-05T17:50:00.000Z", meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 14, replied: 0, repliedAt: null, meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 15, replied: 0, repliedAt: null, meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
    { giftSendId: 16, replied: 1, repliedAt: "2026-10-06T12:14:00.000Z", meetingBooked: 0, meetingDate: null, opportunityValueUsd: null, stage: "none" },
  ];

  const tx = db.transaction(() => {
    for (const row of companies) insertCompany.run(row);
    for (const row of events) insertEvent.run(row);
    for (const row of contacts) insertContact.run(row);
    for (const row of gifts) insertGift.run(row);
    for (const row of sends) insertSend.run(row);
    for (const row of outcomes) insertOutcome.run(row);
    for (const month of ["2026-07", "2026-08", "2026-09", "2026-10"]) {
      insertBudget.run({ month, allocatedUsd: 2500 });
    }
  });
  tx();
}
