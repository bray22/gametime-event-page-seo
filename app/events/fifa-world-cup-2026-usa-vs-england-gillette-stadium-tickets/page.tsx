import type { Metadata } from "next";
import Image from "next/image";
import { LiveOffers } from "@/components/live-offers";
import { event } from "@/lib/event-data";

export const revalidate = 60;

const sortedOffers = [...event.offers].sort((a, b) => a.price - b.price);
const lowPrice = sortedOffers[0]?.price ?? event.minPrice;
const highPrice = sortedOffers[sortedOffers.length - 1]?.price ?? event.minPrice;

function getEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    description: event.description,
    startDate: event.dateIso,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [event.image],
    url: event.url,
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressRegion: event.region,
        addressCountry: event.country,
      },
    },
    competitor: [
      {
        "@type": "SportsTeam",
        name: "USA",
      },
      {
        "@type": "SportsTeam",
        name: "England",
      },
    ],
    organizer: {
      "@type": "Organization",
      name: "Gametime",
      url: "https://gametime.co",
    },
    offers: sortedOffers.map((offer) => ({
      "@type": "Offer",
      price: offer.price,
      priceCurrency: event.currency,
      availability: "https://schema.org/InStock",
      url: event.url,
      category: `Section ${offer.section}, Row ${offer.row}`,
      validFrom: new Date().toISOString(),
    })),
  };
}

function getBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Gametime",
        item: "https://gametime.co",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Soccer Tickets",
        item: "https://gametime.co/soccer",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: event.shortName,
        item: event.url,
      },
    ],
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${event.shortName} | ${event.displayDate} at ${event.venue} | Gametime`;
  const description = `${event.description} Find verified resale tickets from $${lowPrice}. Live inventory snapshot in the initial HTML.`;

  return {
    title,
    description,
    alternates: {
      canonical: event.url,
    },
    keywords: [
      "USA vs England tickets",
      "FIFA World Cup 2026 tickets",
      `${event.venue} tickets`,
      `${event.city} soccer tickets`,
      `${event.shortName}`,
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: event.url,
      type: "website",
      images: [
        {
          url: event.image,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [event.image],
    },
    other: {
      "og:site_name": "Gametime",
    },
  };
}

export default function EventPage() {
  const eventJsonLd = getEventJsonLd();
  const breadcrumbJsonLd = getBreadcrumbJsonLd();

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold uppercase tracking-[0.28em]">
            Gametime
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-6xl space-y-8 px-6 py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a className="hover:text-white" href="https://gametime.co">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a className="hover:text-white" href="https://gametime.co/soccer">
                Soccer Tickets
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white">{event.shortName}</li>
          </ol>
        </nav>

        <section className="relative min-h-[460px] overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900 shadow-2xl">
          <Image
            src={event.image}
            alt="Gillette Stadium set up for soccer"
            fill
            priority
            className="scale-[1.04] object-cover object-center blur-[1px]"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.52)_42%,rgba(0,0,0,0.28)_72%,rgba(0,0,0,0.38)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.16)_45%,rgba(0,0,0,0.58)_100%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.12),transparent_28%)]" />

          <div className="relative grid min-h-[460px] gap-8 p-6 md:p-10 lg:grid-cols-[1.35fr_360px] lg:items-end">
            <div className="flex flex-col justify-end space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-amber-200">
                  FIFA World Cup 2026
                </span>
                <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Verified resale tickets
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                  {event.name}
                </h1>

                <p className="max-w-2xl text-base leading-7 text-neutral-200 md:text-lg">
                  One of the biggest knockout matches of the tournament, live at {event.venue}. Browse a crawlable inventory snapshot first, then refresh into live pricing after hydration.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-neutral-200">
                <time
                  dateTime={event.dateIso}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md"
                >
                  {event.displayDate}
                </time>

                <address className="not-italic rounded-2xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md">
                  {event.venue}, {event.city}, {event.region}
                </address>
              </div>
            </div>

            <aside className="self-end rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
              <p className="text-sm text-neutral-300">Starting at</p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  ${lowPrice}
                </span>
                <span className="pb-1 text-sm text-neutral-300">per ticket</span>
              </div>

              <dl className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <dt className="text-sm text-neutral-300">Listings</dt>
                  <dd className="text-sm font-medium text-white">{sortedOffers.length}</dd>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <dt className="text-sm text-neutral-300">Price range</dt>
                  <dd className="text-sm font-medium text-white">
                    ${lowPrice} - ${highPrice}
                  </dd>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <dt className="text-sm text-neutral-300">Delivery</dt>
                  <dd className="text-sm font-medium text-white">Instant mobile transfer</dd>
                </div>
              </dl>

              <a
                href="#tickets-heading"
                className="mt-5 block w-full rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                View tickets
              </a>
            </aside>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <LiveOffers initialOffers={sortedOffers} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="text-xl font-semibold">About this event</h2>
          <p className="leading-relaxed text-neutral-300">{event.description}</p>
          <p className="leading-relaxed text-neutral-300">
            This implementation uses ISR for the event shell and an inventory snapshot in the initial HTML. That makes the page crawl-safe and fast for first paint, while the client refresh keeps pricing reasonably fresh without forcing search crawlers to execute JavaScript.
          </p>
        </section>
      </article>
    </main>
  );
}
