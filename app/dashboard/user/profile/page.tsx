import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { EditProfileForm } from "@/components/dashboard/edit-profile-form";

export default async function UserProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/signin?next=/dashboard/user/profile");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/dashboard");
  }

  return (
    <section className="container-shell py-8">
      <Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900 mb-6">
        ← Back to Dashboard
      </Link>

      <div className="max-w-4xl">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 sticky top-24">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-(--brand) flex items-center justify-center text-white text-4xl font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="mt-4 text-2xl font-bold">{session.user.name}</h2>
                <p className="mt-1 text-sm text-stone-600">{session.user.email}</p>
                <span className="mt-3 inline-block px-3 py-1 text-xs font-semibold bg-(--brand)/10 text-(--brand) rounded-full">
                  Customer
                </span>
              </div>

              <div className="mt-6 space-y-3 border-t border-stone-100 pt-6">
                <div>
                  <p className="text-xs uppercase text-stone-500 font-semibold tracking-wide">Account Status</p>
                  <p className="mt-2 text-sm text-green-600 font-semibold">✓ Active</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-stone-500 font-semibold tracking-wide">Member Since</p>
                  <p className="mt-2 text-sm text-stone-700">
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              <Link
                href="/messages"
                className="mt-6 w-full rounded-lg bg-(--brand) px-4 py-2 text-sm font-semibold text-white block text-center hover:bg-(--brand)/90"
              >
                💬 View Messages
              </Link>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-8">
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="mt-2 text-stone-600">Update your personal information and preferences</p>
              
              <EditProfileForm 
                user={{
                  name: session.user.name || "",
                  email: session.user.email || "",
                  role: session.user.role || "CUSTOMER",
                }}
              />
            </div>

            {/* Quick Stats */}
            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="text-lg font-bold mb-4">Activity Summary</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-(--brand)">0</p>
                  <p className="text-xs text-stone-600 mt-1">Total Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-(--brand)">0</p>
                  <p className="text-xs text-stone-600 mt-1">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-(--brand)">0</p>
                  <p className="text-xs text-stone-600 mt-1">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
