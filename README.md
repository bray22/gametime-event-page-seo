# Gametime Event Page – SEO & Crawlability

This project implements a **crawlable, performant event page** designed to compete for organic search traffic against marketplaces like StubHub, SeatGeek, and Ticketmaster.

The goal is to ensure that when a fan searches for an event (e.g. *“USA vs England tickets June 15”*), the page:
- is discoverable and indexable by search engines  
- loads quickly, even on mobile  
- clearly communicates event and ticket data to Google  

---

## Rendering Strategy

I chose a **hybrid ISR (Incremental Static Regeneration) + client hydration** approach using Next.js App Router.

### Why this approach

- **Server-rendered HTML** ensures fast initial load and crawlability  
- **ISR** keeps content reasonably fresh without sacrificing performance  
- **Client-side hydration** enables near real-time ticket updates after load  

### Implementation

- Uses `export const revalidate = 60`  
- The page is regenerated every 60 seconds  
- Users and crawlers receive fast, cacheable HTML with a fresh inventory snapshot  

---

## What Googlebot Sees

A crawler requesting this page receives fully rendered HTML **without needing JavaScript**.

The initial HTML includes:

- `<h1>` event title  
- Event description  
- `<time>` element with ISO datetime  
- `<address>` element with venue and location  
- Server-rendered ticket listings (price, section, row)  
- Breadcrumb navigation  
- JSON-LD structured data (`SportsEvent`, `Offer`, `BreadcrumbList`)  

This ensures:

- proper indexing  
- strong keyword relevance  
- eligibility for rich results  

---

## Structured Data (JSON-LD)

The page includes **schema.org structured data** using:

- `SportsEvent`  
- `Offer`  
- `Place`  
- `PostalAddress`  
- `BreadcrumbList`  

### Signals sent to Google

- Event name, date, and location  
- Performers (teams)  
- Ticket availability and pricing  
- Canonical event URL  
- Page hierarchy via breadcrumbs  

This helps Google understand that the page represents a **ticketed event**, improving ranking potential and eligibility for rich results.

---

## Semantic HTML

The page uses semantic, crawler-friendly HTML:

- `main`, `article`, `section`, `nav`  
- `h1`, `h2`  
- `time` (machine-readable date)  
- `address` (structured location)  
- `ul` / `li` (ticket listings)  

This allows search engines to understand the content **without executing JavaScript**.

---

## Handling Live Inventory (Fast + Fresh)

Ticket inventory changes frequently, so the page uses a **two-layer approach**:

### 1. Server-rendered snapshot  
- Ticket listings are included in the initial HTML  
- Ensures fast load and crawlability  

### 2. Client-side refresh  
- After hydration, the page fetches updated inventory from `/api/inventory`  
- Keeps prices fresh without blocking initial render  

### Why this works

- Users see content immediately  
- Crawlers receive complete data  
- Inventory stays reasonably up to date  

---

## Tradeoffs

**Chosen approach:** ISR + client refresh  

### Pros
- Fast initial load  
- Fully crawlable HTML  
- Good balance of freshness and performance  
- Simple and scalable architecture  

### Cons
- Inventory may be up to ~60 seconds stale in server-rendered HTML  
- Requires client-side fetch for real-time updates  

---

## What I’d Do With More Time

- Integrate real backend inventory data  
- Improve structured data accuracy (availability, quantity, dynamic pricing updates)  
- Add internal linking (teams, venues, leagues)  
- Implement edge caching / CDN optimization  
- Expand SEO surface area (team pages, matchup pages, date-based listings)  
- Optimize Core Web Vitals (especially LCP)  

---

## Tech Stack

- Next.js (App Router)  
- React  
- TypeScript  

---

## Summary

This implementation prioritizes:

- **Crawlability first** (server-rendered HTML + structured data)  
- **Performance** (ISR + fast initial render)  
- **Freshness** (client-side inventory updates)  
