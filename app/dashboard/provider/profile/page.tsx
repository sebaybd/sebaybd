import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { EditProviderProfileForm } from "@/components/dashboard/edit-provider-profile-form";

export default async function ProviderProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/signin?next=/dashboard/provider/profile");
  }

  if (session.user.role !== "PROVIDER") {
    redirect("/dashboard");
  }

  return (
    <section className="container-shell py-8">
      <Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900 mb-6">
        ← Back to Dashboard
      </Link>

      <div className="max-w-4xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Provider Card */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 sticky top-24">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-(--brand) flex items-center justify-center text-white text-4xl font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || "P"}
                </div>
                <h2 className="mt-4 text-2xl font-bold">{session.user.name}</h2>
                <p className="mt-1 text-sm text-stone-600">{session.user.email}</p>
                <span className="mt-3 inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                  Service Provider
                </span>
              </div>

              <div className="mt-6 space-y-3 border-t border-stone-100 pt-6">
                <div>
                  <p className="text-xs uppercase text-stone-500 font-semibold tracking-wide">Account Status</p>
                  <p className="mt-2 text-sm text-green-600 font-semibold">✓ Active & Verified</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-stone-500 font-semibold tracking-wide">Rating</p>
                  <p className="mt-2 text-sm font-semibold">⭐ 4.8 (24 reviews)</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-stone-500 font-semibold tracking-wide">Monthly Earnings</p>
                  <p className="mt-2 text-lg font-bold text-(--brand)">৳ 45,500</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Link
                  href="/dashboard/provider"
                  className="flex-1 rounded-lg bg-(--brand)/10 text-(--brand) px-4 py-2 text-sm font-semibold text-center hover:bg-(--brand)/20"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/messages"
                  className="flex-1 rounded-lg bg-(--brand) text-white px-4 py-2 text-sm font-semibold text-center hover:bg-(--brand)/90"
                >
                  💬 Messages
                </Link>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-8">
              <h1 className="text-3xl font-bold">Edit Provider Profile</h1>
              <p className="mt-2 text-stone-600">Update your professional information and service details</p>
              
              <EditProviderProfileForm 
                user={{
                  name: session.user.name || "",
                  email: session.user.email || "",
                }}
              />
            </div>

            {/* Performance Metrics */}
            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-(--brand)">18</p>
                  <p className="text-xs text-stone-600 mt-1">Active Services</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-(--brand)">156</p>
                  <p className="text-xs text-stone-600 mt-1">Total Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-(--brand)">89%</p>
                  <p className="text-xs text-stone-600 mt-1">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-(--brand)">2.4h</p>
                  <p className="text-xs text-stone-600 mt-1">Avg Response</p>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
              <h3 className="text-lg font-bold text-green-900 mb-3">✓ Verification Status</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>✓ Email verified</p>
                <p>✓ Phone verified</p>
                <p>✓ Identity verified</p>
                <p>✓ Background check cleared</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
