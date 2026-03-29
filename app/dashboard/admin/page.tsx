import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminBookingModeration } from "@/components/dashboard/admin-booking-moderation";
import { ProviderApprovalQueue } from "@/components/dashboard/provider-approval-queue";
import { StatCard } from "@/components/dashboard/stat-card";
import { auth } from "@/auth";
import { getAdminDashboardData } from "@/lib/dashboard-data";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?next=/dashboard/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const {
    totalUsers,
    totalProviders,
    totalServices,
    pendingBookings,
    completedBookings,
    categoryBreakdown,
    providerLeaderboard,
  } = getAdminDashboardData();

  let pendingProviders: Array<{
    providerProfileId: string;
    userId: string;
    name: string;
    email: string;
    division: string;
    district: string;
    area: string;
    createdAt: string;
  }> = [];

  try {
    const profiles = await prisma.providerProfile.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    pendingProviders = profiles.map((profile: (typeof profiles)[number]) => ({
      providerProfileId: profile.id,
      userId: profile.user.id,
      name: profile.user.name,
      email: profile.user.email ?? "No email",
      division: profile.division,
      district: profile.district,
      area: profile.area,
      createdAt: profile.createdAt.toISOString(),
    }));
  } catch {
    pendingProviders = [];
  }

  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-stone-600">Monitor platform growth, provider activity, service coverage, and booking health.</p>

      <div className="mt-6 rounded-3xl bg-(--brand) p-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Marketplace Control Center</p>
            <h2 className="mt-2 text-2xl font-bold">Bangladesh Service Operations Overview</h2>
            <p className="text-sm text-white/80">Track providers, service inventory, and booking flow in one place.</p>
          </div>
          <Link href="/providers" className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white">
            Review Providers
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} note="Customers and providers in sample mode" />
        <StatCard label="Providers" value={totalProviders} note="Approved service professionals" />
        <StatCard label="Services" value={totalServices} note="Published service listings" />
        <StatCard label="Pending Bookings" value={pendingBookings.length} note="Jobs waiting for action" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-bold">Booking Health</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <StatCard label="Completed Jobs" value={completedBookings.length} />
            <StatCard label="Completion Rate" value={`${Math.round((completedBookings.length / Math.max(pendingBookings.length + completedBookings.length, 1)) * 100)}%`} />
          </div>
          <div className="mt-5 space-y-3">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-stone-100 p-3 text-sm">
                <p className="font-semibold">{booking.problemText}</p>
                <p className="text-stone-600">Provider: {booking.providerName}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-bold">Service Category Coverage</h2>
          <div className="mt-4 space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold">{category.name}</span>
                  <span className="text-stone-500">{category.totalServices} services</span>
                </div>
                <div className="h-3 rounded-full bg-stone-100">
                  <div
                    className="h-3 rounded-full bg-(--accent)"
                    style={{ width: `${Math.max((category.totalServices / Math.max(totalServices, 1)) * 100, 12)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Provider Leaderboard</h2>
          <span className="text-sm text-stone-500">Related service performance</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-stone-500">
              <tr>
                <th className="pb-3">Provider</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Services</th>
                <th className="pb-3">Bookings</th>
                <th className="pb-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {providerLeaderboard.map((provider) => (
                <tr key={provider.id} className="border-t border-stone-100">
                  <td className="py-3 font-semibold">{provider.name}</td>
                  <td className="py-3 text-stone-600">{provider.area}, {provider.district}</td>
                  <td className="py-3">{provider.activeServices}</td>
                  <td className="py-3">{provider.totalBookings}</td>
                  <td className="py-3">⭐ {provider.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <ProviderApprovalQueue initialItems={pendingProviders} />
      </div>

      <div className="mt-8">
        <AdminBookingModeration initialBookings={pendingBookings} />
      </div>
    </section>
  );
}
