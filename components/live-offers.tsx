"use client";

import { useEffect, useMemo, useState } from "react";

type Offer = {
  id?: string;
  section: string;
  row: string;
  price: number;
  quantity?: number;
  notes?: string;
};

type LiveOffersProps = {
  initialOffers: Offer[];
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function LiveOffers({ initialOffers }: LiveOffersProps) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [updatedAt, setUpdatedAt] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function refreshOffers() {
      try {
        setIsRefreshing(true);

        const res = await fetch("/api/inventory", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (!isMounted) return;

        if (Array.isArray(data?.offers)) {
          const sorted = [...data.offers].sort(
            (a: Offer, b: Offer) => a.price - b.price
          );
          setOffers(sorted);
          setUpdatedAt(new Date());
        }
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    }

    const timeout = setTimeout(refreshOffers, 1500);
    const interval = setInterval(refreshOffers, 30000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const lowestPrice = useMemo(
    () =>
      offers.reduce(
        (min, o) => Math.min(min, o.price),
        offers[0]?.price ?? 0
      ),
    [offers]
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                ● Live inventory
              </span>
              <span className="text-xs text-neutral-500">
                {offers.length} listings
              </span>
              {isRefreshing && (
                <span className="text-xs text-neutral-400">
                  Updating…
                </span>
              )}
            </div>

            <h2
              id="tickets-heading"
              className="text-xl font-semibold text-neutral-900"
            >
              Available Tickets
            </h2>

            <p className="text-sm text-neutral-600">
              Prices start at{" "}
              <span className="font-semibold text-neutral-900">
                ${lowestPrice}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2">
              <div className="text-xs text-neutral-500">Lowest</div>
              <div className="text-lg font-semibold">
                ${lowestPrice}
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2">
              <div className="text-xs text-neutral-500">Updated</div>
              <div className="text-sm font-medium">
                {formatTime(updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket list */}
      <ul className="divide-y rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {offers.map((offer, index) => {
          const isBest = offer.price === lowestPrice;

          return (
            <li
              key={offer.id ?? `${offer.section}-${index}`}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-neutral-50"
            >
              {/* Left */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {isBest && (
                    <span className="text-xs font-medium text-emerald-600">
                      Best price
                    </span>
                  )}
                  <span className="text-xs text-neutral-400">
                    Section {offer.section}
                  </span>
                </div>

                <div className="text-sm text-neutral-600">
                  Row {offer.row}
                  {offer.quantity && ` • ${offer.quantity} tickets`}
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xl font-semibold text-neutral-900">
                    ${offer.price}
                  </div>
                  <div className="text-xs text-neutral-500">
                    per ticket
                  </div>
                </div>

                <button className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">
                  View
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}