"use client";

import { useState, useTransition } from "react";
import { BookingSummary } from "@/types/marketplace";

interface AdminBookingModerationProps {
  initialBookings: BookingSummary[];
}

export function AdminBookingModeration({ initialBookings }: AdminBookingModerationProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateBookingStatus = (bookingId: string, status: BookingSummary["status"]) => {
    startTransition(async () => {
      setMessage(null);

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.message ?? "Failed to update booking status.");
        return;
      }

      setBookings((current) =>
        current.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking))
      );
      setMessage(payload.message ?? "Booking updated.");
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Booking Approval Queue</h2>
        <span className="text-sm text-stone-500">Approve or reject incoming jobs</span>
      </div>
      {message ? <p className="mt-3 text-sm text-(--brand)">{message}</p> : null}
      <div className="mt-4 space-y-3">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-xl border border-stone-100 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold">{booking.problemText}</h3>
                <p className="text-sm text-stone-600">{booking.customerName} → {booking.providerName}</p>
                <p className="text-xs text-stone-500">Current status: {booking.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending || booking.status === "ACCEPTED"}
                  onClick={() => updateBookingStatus(booking.id, "ACCEPTED")}
                  className="rounded-full bg-(--brand) px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={isPending || booking.status === "CANCELLED"}
                  onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                  className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
