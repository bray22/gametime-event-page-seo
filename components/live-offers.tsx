"use client";

import { useEffect, useMemo, useState } from "react";

type Offer = {
  id: string;
  section: string;
  row: string;
  price: number;
};

type LiveOffersProps = {
  initialOffers: Offer[];
};

function getDealLabel(price: number, lowestPrice: number) {
  if (price === lowestPrice) {
    return {
      label: "Best price",
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (price <= lowestPrice + 40) {
    return {
      label: "Great value",
      className: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    };
  }

  if (price >= lowestPrice + 300) {
    return {
      label: "Premium",
      className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    };
  }

  return {
    label: "Popular",
    className: "border-white/10 bg-white/5 text-neutral-300",
  };
}

function getRowLabel(row: string) {
  const normalized = row.toLowerCase();

  if (normalized.includes("field")) return "Pitchside feel";
  if (normalized.includes("1") || normalized.includes("2") || normalized.includes("3")) {
    return "Closer view";
  }

  return "Good sightline";
}

export function LiveOffers({ initialOffers }: LiveOffersProps) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

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
        // ignore demo errors
      }
    };

    const timeout = setTimeout(loadOffers, 150);
    const interval = setInterval(loadOffers, 30000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isMounted]);

  const sortedOffers = useMemo(
    () => [...offers].sort((a, b) => a.price - b.price),
    [offers]
  );

  const lowestPrice = Math.min(...sortedOffers.map((offer) => offer.price));
  const totalListings = sortedOffers.length;

  return (
    <section aria-labelledby="tickets-heading" className="space-y-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live inventory
            </span>

            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
              {totalListings} listings
            </span>
          </div>

          <div>
            <h2
              id="tickets-heading"
              className="text-2xl font-semibold tracking-tight text-white"
            >
              Available Tickets
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Lowest available price is{" "}
              <span className="font-medium text-white">${lowestPrice}</span> right now.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:min-w-[260px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              Lowest
            </p>
            <p className="mt-1 text-lg font-semibold text-white">${lowestPrice}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              Updated
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              {updatedAt ? (
                <time dateTime={updatedAt}>
                  {new Date(updatedAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </time>
              ) : (
                "Just now"
              )}
            </p>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {sortedOffers.map((offer, index) => {
          const deal = getDealLabel(offer.price, lowestPrice);
          const isBest = index === 0;

          return (
            <li key={offer.id}>
              <article
                className={`group rounded-3xl border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] ${
                  isBest
                    ? "border-emerald-400/20 bg-emerald-400/[0.06]"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${deal.className}`}
                      >
                        {deal.label}
                      </span>

                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-neutral-300">
                        {getRowLabel(offer.row)}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-lg font-semibold text-white md:text-xl">
                          Section {offer.section}
                        </h3>
                        <span className="text-sm text-neutral-500">•</span>
                        <p className="text-sm text-neutral-300">Row {offer.row}</p>
                      </div>

                      <p className="mt-1 text-sm text-neutral-400">
                        Clear view of the match with secure mobile ticket delivery.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 md:block md:min-w-[150px] md:text-right">
                    <div>
                      <p className="text-2xl font-semibold tracking-tight text-white">
                        ${offer.price}
                      </p>
                      <p className="text-xs text-neutral-500">per ticket</p>
                    </div>

                    <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10 group-hover:bg-white group-hover:text-black">
                      Select
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
