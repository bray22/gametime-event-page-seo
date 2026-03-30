import { event } from "@/lib/event-data";

export default function EventPage() {
  return (
    <main>
      <article>
        {/* Header */}
        <header>
          <h1>{event.name}</h1>

          <p>
            <time dateTime={event.dateIso}>{event.displayDate}</time>
          </p>

          <address>
            {event.venue}, {event.city}
          </address>

          <p>Tickets from ${event.minPrice}</p>
        </header>

        {/* Ticket Offers */}
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

        {/* Event Description */}
        <section aria-labelledby="about-heading">
          <h2 id="about-heading">About this event</h2>
          <p>{event.description}</p>
        </section>
      </article>
    </main>
  );
}
