import type { Metadata } from "next";
import { event } from "@/lib/event-data";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${event.shortName} – FIFA World Cup 2026 Quarterfinal at ${event.venue} | Gametime`,
    description: `${event.description} Tickets from $${event.minPrice}.`,
    alternates: {
      canonical: event.url,
    },
    openGraph: {
      title: `${event.shortName} – FIFA World Cup 2026 Quarterfinal at ${event.venue}`,
      description: `${event.description} Tickets from $${event.minPrice}.`,
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
      title: `${event.shortName} – FIFA World Cup 2026 Quarterfinal at ${event.venue}`,
      description: `${event.description} Tickets from $${event.minPrice}.`,
      images: [event.image],
    },
  };
}

export default function EventPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.dateIso,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: event.description,
    image: [event.image],
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
    performer: [
      { "@type": "SportsTeam", name: "USA" },
      { "@type": "SportsTeam", name: "England" },
    ],
    offers: {
      "@type": "Offer",
      url: event.url,
      price: event.minPrice,
      priceCurrency: event.currency,
      availability: "https://schema.org/InStock",
      validFrom: "2026-03-30T09:00:00-04:00",
    },
  };

  return (
    <main>
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header>
          <h1>{event.name}</h1>

          <p>
            <time dateTime={event.dateIso}>{event.displayDate}</time>
          </p>

          <address>
            {event.venue}, {event.city}, {event.region}
          </address>

          <p>Tickets from ${event.minPrice}</p>
        </header>

        <section aria-labelledby="tickets-heading">
          <h2 id="tickets-heading">Available Tickets</h2>
          <ul>
            {event.offers.map((offer) => (
              <li key={offer.id}>
                Section {offer.section} · Row {offer.row} · ${offer.price}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="about-heading">
          <h2 id="about-heading">About this event</h2>
          <p>{event.description}</p>
        </section>
      </article>
    </main>
  );
}
