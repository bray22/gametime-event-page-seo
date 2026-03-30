"use client";

import { useEffect, useState } from "react";

type Offer = {
  id: string;
  section: string;
  row: string;
  price: number;
};

type LiveOffersProps = {
  initialOffers: Offer[];
};

export function LiveOffers({ initialOffers }: LiveOffersProps) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOffers = async () => {
      try {
        const response = await fetch("/api/inventory", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled) {
          setOffers(data.offers);
          setUpdatedAt(data.updatedAt);
        }
      } catch {
        // ignore demo fetch errors
      }
    };

    loadOffers();

    const interval = setInterval(loadOffers, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const lowestPrice = Math.min(...offers.map((offer) => offer.price));

  return (
    <section aria-labelledby="tickets-heading">
      <div>
        <h2 id="tickets-heading">Available Tickets</h2>
        <p>Live inventory update. Lowest price now ${lowestPrice}.</p>
        {updatedAt ? (
          <p>
            Last updated:{" "}
            <time dateTime={updatedAt}>
              {new Date(updatedAt).toLocaleTimeString()}
            </time>
          </p>
        ) : null}
      </div>

      <ul>
        {offers.map((offer) => (
          <li key={offer.id}>
            Section {offer.section} · Row {offer.row} · ${offer.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
