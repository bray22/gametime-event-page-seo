export type Offer = {
  id: string;
  section: string;
  row: string;
  price: number;
};

export const event = {
  slug: "fifa-world-cup-2026-usa-vs-england-gillette-stadium-tickets",
  name: "FIFA World Cup 2026 Quarterfinal — USA vs England",
  shortName: "USA vs England Tickets",
  venue: "Gillette Stadium",
  city: "Foxborough",
  region: "MA",
  country: "US",
  dateIso: "2026-07-11T17:00:00-04:00",
  displayDate: "July 11, 2026 • 5:00 PM",
  minPrice: 325,
  currency: "USD",
  description:
    "Buy tickets for the FIFA World Cup 2026 Quarterfinal between USA and England at Gillette Stadium in Foxborough, MA.",
  image:
    "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80",
  url: "https://your-vercel-domain.vercel.app/events/fifa-world-cup-2026-usa-vs-england-gillette-stadium-tickets",
  offers: [
    { id: "1", section: "130", row: "12", price: 325 },
    { id: "2", section: "205", row: "18", price: 275 },
    { id: "3", section: "VIP", row: "Field", price: 950 },
  ] satisfies Offer[],
};
