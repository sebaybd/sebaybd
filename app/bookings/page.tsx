import { sampleBookings } from "@/lib/sample-data";

export default function BookingsPage() {
  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Bookings</h1>
      <p className="mt-2 text-stone-600">Pending, accepted, completed, and cancelled jobs.</p>
      <div className="mt-6 space-y-3">
        {sampleBookings.map((booking) => (
          <article key={booking.id} className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="font-semibold">{booking.problemText}</p>
            <p className="text-sm text-stone-600">
              {booking.customerName} ↔ {booking.providerName}
            </p>
            <p className="text-xs text-stone-500">Status: {booking.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
