"use client";

import { BookingSummary } from "@/types/marketplace";

interface ActivityTimelineProps {
  bookings: BookingSummary[];
}

export function ActivityTimeline({ bookings }: ActivityTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "ACCEPTED":
        return "✓";
      case "COMPLETED":
        return "✓✓";
      case "CANCELLED":
        return "✗";
      default:
        return "•";
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {bookings.slice(0, 5).map((booking, index) => (
          <div key={booking.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`${getStatusColor(booking.status)} rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm`}>
                {getStatusIcon(booking.status)}
              </div>
              {index < bookings.length - 1 && <div className="w-0.5 h-12 bg-stone-200 mt-1" />}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-stone-900">Service Booking #{booking.id.slice(0, 6)}</p>
                  <p className="text-sm text-stone-600">{booking.problemText}</p>
                </div>
                <span className={`${getStatusColor(booking.status)} px-2 py-1 rounded text-xs font-semibold`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                {new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-sm text-stone-600 text-center py-4">No bookings yet. Start by finding a service!</p>
        )}
      </div>
    </div>
  );
}
