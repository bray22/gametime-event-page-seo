import type { Metadata } from "next";
import { LiveOffers } from "@/components/live-offers";
import { event } from "@/lib/event-data";

export const revalidate = 60;

const sortedOffers = [...event.offers].sort((a, b) => a.price - b.price);
const lowPrice = sortedOffers[0]?.price ?? event.minPrice;
const highPrice =
  sortedOffers[sortedOffers.length - 1]?.price ?? event.minPrice;

function getEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    description: event.description,
    startDate: event.dateIso,
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
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
      { "@type": "SportsTeam", name: "USA" },
      { "@type": "SportsTeam", name: "England" },
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
  const description = `${event.description} Find verified resale tickets from $${lowPrice}.`;

  return {
    title,
    description,
    alternates: {
      canonical: event.url,
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
  };
}

export default function EventPage() {
  const eventJsonLd = getEventJsonLd();
  const breadcrumbJsonLd = getBreadcrumbJsonLd();

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold uppercase tracking-wide">
            Gametime
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a className="hover:text-neutral-900" href="#">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a className="hover:text-neutral-900" href="#">
                Soccer Tickets
              </a>
            </li>
            <li>/</li>
            <li className="text-neutral-900">{event.shortName}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="relative min-h-[380px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Image */}
          <div className="absolute inset-0">
            <img
              src={event.image}
              alt=""
              className="h-full w-full object-cover object-center opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-white/10" />
          </div>

          {/* Content */}
          <div className="relative z-10 grid min-h-[380px] gap-10 p-8 md:p-10 lg:grid-cols-[1.4fr_360px] lg:items-end">
            {/* Left */}
            <div className="space-y-5">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                {event.name}
              </h1>

              <p className="max-w-2xl text-neutral-700">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-3 text-sm">
                <time
                  dateTime={event.dateIso}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 shadow-sm"
                >
                  {event.displayDate}
                </time>

                <address className="not-italic rounded-lg border border-neutral-200 bg-white px-3 py-1.5 shadow-sm">
                  {event.venue}, {event.city}, {event.region}
                </address>
              </div>
            </div>

            {/* Pricing Card */}
            <aside className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <p className="text-sm text-neutral-500">Starting at</p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight">
                  ${lowPrice}
                </span>
                <span className="text-sm text-neutral-500">
                  per ticket
                </span>
              </div>

              <dl className="mt-5 space-y-3">
                <div className="flex justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                  <dt className="text-sm text-neutral-500">Listings</dt>
                  <dd className="font-medium">{sortedOffers.length}</dd>
                </div>

                <div className="flex justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                  <dt className="text-sm text-neutral-500">Price range</dt>
                  <dd className="font-medium">
                    ${lowPrice} - ${highPrice}
                  </dd>
                </div>

                <div className="flex justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                  <dt className="text-sm text-neutral-500">Delivery</dt>
                  <dd className="font-medium">
                    Instant mobile transfer
                  </dd>
                </div>
              </dl>

              <a
                href="#tickets-heading"
                className="mt-5 block w-full rounded-lg bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-800"
              >
                View tickets
              </a>
            </aside>
          </div>
        </section>

        {/* Tickets */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <LiveOffers initialOffers={sortedOffers} />
        </section>

        {/* About */}
        <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">About this event</h2>
          <p className="text-neutral-600">{event.description}</p>
        </section>
      </article>
    </main>
  );
}
