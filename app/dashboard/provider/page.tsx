import Link from "next/link";
import { redirect } from "next/navigation";
import { ProviderServiceManager } from "@/components/dashboard/provider-service-manager";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProviderQuickActions } from "@/components/dashboard/provider-quick-actions";
import { EarningsSummary } from "@/components/dashboard/earnings-summary";
import { auth } from "@/auth";
import { getProviderDashboardData } from "@/lib/dashboard-data";

export default async function ProviderDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?next=/dashboard/provider");
  }
  if (session.user.role !== "PROVIDER") {
    redirect("/dashboard");
  }

  const { provider, services, bookings, completedBookings, pendingBookings, relatedMessages, estimatedEarnings } =
    getProviderDashboardData();

  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Provider Dashboard</h1>
      <p className="mt-2 text-stone-600">Manage profile, services, bookings, customer messages, and revenue signals.</p>

      <div className="mt-6 rounded-3xl bg-(--brand) p-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Active Provider</p>
            <h2 className="mt-2 text-2xl font-bold">{provider.name}</h2>
            <p className="text-sm text-white/80">{provider.title} • {provider.area}, {provider.district}</p>
          </div>
          <Link
            href="/dashboard/provider/profile"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Active Services" value={services.length} note="Visible service listings" />
        <StatCard label="Pending Bookings" value={pendingBookings.length} note="Awaiting your action" />
        <StatCard label="Completed Jobs" value={completedBookings.length} note="Successful bookings" />
        <StatCard label="Monthly Earnings" value={\u0627 \} note="Revenue projection" />
      </div>

      <ProviderQuickActions />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <ProviderServiceManager providerId={provider.id} initialServices={services} />

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Recent Service Requests</h2>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="rounded-lg border border-stone-200 p-4 hover:bg-stone-50">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-stone-900">{booking.problemText}</p>
                      <p className="text-sm text-stone-600 mt-1">Customer: {booking.customerName}</p>
                      <p className="text-xs text-stone-500 mt-1">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                    </div>
                    <span className={px-3 py-1 rounded-full text-xs font-semibold \}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-sm text-stone-600 text-center py-8">No service requests yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <EarningsSummary
            monthlyEarnings={Math.floor(estimatedEarnings / 12)}
            totalEarnings={estimatedEarnings}
            completedJobs={completedBookings.length}
            rating={4.8}
            responseTime="2.4h"
          />

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold mb-4">Latest Customer Messages</h2>
            <div className="space-y-3">
              {relatedMessages.slice(0, 4).map((message) => (
                <div key={message.id} className="rounded-lg border border-stone-100 p-3 hover:bg-stone-50">
                  <p className="font-semibold text-sm">{message.from}</p>
                  <p className="text-sm text-stone-600 mt-1">{message.content}</p>
                </div>
              ))}
              {relatedMessages.length === 0 && (
                <p className="text-sm text-stone-600 text-center py-4">No messages yet</p>
              )}
            </div>
            <Link href="/messages" className="text-(--brand) text-sm font-semibold mt-3 inline-block hover:underline">
              View all messages ?
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Booking Pipeline Overview</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-700 font-semibold">Pending</p>
            <p className="text-2xl font-bold text-yellow-900 mt-2">{pendingBookings.length}</p>
            <p className="text-xs text-yellow-600 mt-1">Awaiting your response</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-700 font-semibold">In Progress</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{bookings.filter(b => b.status === "ACCEPTED").length}</p>
            <p className="text-xs text-blue-600 mt-1">Active jobs</p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-700 font-semibold">Completed</p>
            <p className="text-2xl font-bold text-green-900 mt-2">{completedBookings.length}</p>
            <p className="text-xs text-green-600 mt-1">This month</p>
          </div>
          <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
            <p className="text-sm text-purple-700 font-semibold">Completion Rate</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">{bookings.length > 0 ? Math.round((completedBookings.length / bookings.length) * 100) : 0}%</p>
            <p className="text-xs text-purple-600 mt-1">Overall performance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
