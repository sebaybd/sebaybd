"use client";

import { useMemo, useState, useTransition } from "react";
import { BookingSummary, ServiceSummary } from "@/types/marketplace";

interface UserBookingCenterProps {
  initialBookings: BookingSummary[];
  services: ServiceSummary[];
  reviewedBookingIds: string[];
}

const filters: Array<"ALL" | BookingSummary["status"]> = ["ALL", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"];

export function UserBookingCenter({ initialBookings, services, reviewedBookingIds }: UserBookingCenterProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("ALL");
  const [reviewState, setReviewState] = useState<Record<string, { rating: string; comment: string }>>({});
  const [reviewedIds, setReviewedIds] = useState<string[]>(reviewedBookingIds);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const serviceLookup = useMemo(
    () => Object.fromEntries(services.map((service) => [service.id, service.title])),
    [services]
  );

  const filteredBookings = initialBookings.filter((booking) => activeFilter === "ALL" || booking.status === activeFilter);

  const submitReview = (bookingId: string) => {
    const current = reviewState[bookingId];
    if (!current?.rating) {
      setMessage("Select a rating before submitting a review.");
      return;
    }

    startTransition(async () => {
      setMessage(null);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating: Number(current.rating),
          comment: current.comment || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message ?? "Failed to submit review.");
        return;
      }

      setReviewedIds((currentIds) => [...currentIds, bookingId]);
      setMessage(result.message ?? "Review submitted.");
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold">Booking History</h2>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${activeFilter === filter ? "bg-(--brand) text-white" : "border border-stone-300 text-stone-700"}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        {message ? <p className="mt-3 text-sm text-(--brand)">{message}</p> : null}
        <div className="mt-4 space-y-4">
          {filteredBookings.map((booking) => {
            const review = reviewState[booking.id] ?? { rating: "", comment: "" };
            const alreadyReviewed = reviewedIds.includes(booking.id);

            return (
              <article key={booking.id} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold">{booking.problemText}</h3>
                    <p className="text-sm text-stone-600">Service: {serviceLookup[booking.serviceId] ?? "Service"}</p>
                    <p className="text-sm text-stone-600">Provider: {booking.providerName}</p>
                  </div>
                  <span className="text-xs font-semibold text-stone-500">{booking.status}</span>
                </div>

                {booking.status === "COMPLETED" ? (
                  <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
                    <p className="text-sm font-semibold">Leave a review</p>
                    {alreadyReviewed ? (
                      <p className="mt-2 text-sm text-(--brand)">Review submitted for this completed booking.</p>
                    ) : (
                      <>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setReviewState((current) => ({
                                  ...current,
                                  [booking.id]: { ...review, rating: String(star) },
                                }))
                              }
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${review.rating === String(star) ? "bg-(--accent) text-foreground" : "border border-stone-300 text-stone-700"}`}
                            >
                              {star} Star
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={review.comment}
                          onChange={(event) =>
                            setReviewState((current) => ({
                              ...current,
                              [booking.id]: { ...review, comment: event.target.value },
                            }))
                          }
                          placeholder="Share your experience"
                          className="mt-3 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                          rows={3}
                        />
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => submitReview(booking.id)}
                          className="mt-3 rounded-full bg-(--brand) px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          Submit Review
                        </button>
                      </>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
