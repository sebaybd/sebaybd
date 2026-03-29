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
            <p className="text-sm text-white/80">
              {provider.title} - {provider.area}, {provider.district}
            </p>
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
        <StatCard
          label="Monthly Earnings"
          value={`BDT ${Math.floor(estimatedEarnings / 12).toLocaleString()}`}
          note="Revenue projection"
        />
      </div>

      <div className="mt-6">
        <ProviderQuickActions />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <ProviderServiceManager providerId={provider.id} initialServices={services} />

          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Recent Service Requests</h2>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => {
                const statusClass =
                  booking.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : booking.status === "ACCEPTED"
                      ? "bg-blue-100 text-blue-700"
                      : booking.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700";

                return (
                  <div key={booking.id} className="rounded-lg border border-stone-200 p-4 hover:bg-stone-50">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-stone-900">{booking.problemText}</p>
                        <p className="mt-1 text-sm text-stone-600">Customer: {booking.customerName}</p>
                        <p className="mt-1 text-xs text-stone-500">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {bookings.length === 0 && (
                <p className="py-8 text-center text-sm text-stone-600">No service requests yet</p>
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
            <h2 className="mb-4 text-xl font-bold">Latest Customer Messages</h2>
            <div className="space-y-3">
              {relatedMessages.slice(0, 4).map((message) => (
                <div key={message.id} className="rounded-lg border border-stone-100 p-3 hover:bg-stone-50">
                  <p className="text-sm font-semibold">{message.from}</p>
                  <p className="mt-1 text-sm text-stone-600">{message.content}</p>
                </div>
              ))}

              {relatedMessages.length === 0 && (
                <p className="py-4 text-center text-sm text-stone-600">No messages yet</p>
              )}
            </div>

            <Link href="/messages" className="mt-3 inline-block text-sm font-semibold text-(--brand) hover:underline">
              View all messages
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Booking Pipeline Overview</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm font-semibold text-yellow-700">Pending</p>
            <p className="mt-2 text-2xl font-bold text-yellow-900">{pendingBookings.length}</p>
            <p className="mt-1 text-xs text-yellow-600">Awaiting your response</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-700">In Progress</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">
              {bookings.filter((booking) => booking.status === "ACCEPTED").length}
            </p>
            <p className="mt-1 text-xs text-blue-600">Active jobs</p>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-700">Completed</p>
            <p className="mt-2 text-2xl font-bold text-green-900">{completedBookings.length}</p>
            <p className="mt-1 text-xs text-green-600">This month</p>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <p className="text-sm font-semibold text-purple-700">Completion Rate</p>
            <p className="mt-2 text-2xl font-bold text-purple-900">
              {bookings.length > 0 ? Math.round((completedBookings.length / bookings.length) * 100) : 0}%
            </p>
            <p className="mt-1 text-xs text-purple-600">Overall performance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
