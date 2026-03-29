import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?next=/dashboard/settings");
  }

  const profileHref = session.user.role === "PROVIDER" ? "/dashboard/provider/profile" : "/dashboard/user/profile";

  return (
    <section className="container-shell py-8">
      <div className="max-w-3xl rounded-2xl border border-stone-200 bg-white p-6">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-2 text-stone-600">Manage your account preferences and profile shortcuts.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link href={profileHref} className="rounded-xl border border-stone-200 p-4 hover:bg-stone-50">
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-1 text-sm text-stone-600">Update your personal and account information.</p>
          </Link>

          <Link href="/messages" className="rounded-xl border border-stone-200 p-4 hover:bg-stone-50">
            <h2 className="text-lg font-semibold">Messages</h2>
            <p className="mt-1 text-sm text-stone-600">Open your latest conversations.</p>
          </Link>

          <Link href="/dashboard" className="rounded-xl border border-stone-200 p-4 hover:bg-stone-50">
            <h2 className="text-lg font-semibold">Dashboard Home</h2>
            <p className="mt-1 text-sm text-stone-600">Return to your role-based dashboard.</p>
          </Link>

          <div className="rounded-xl border border-stone-200 p-4">
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="mt-1 text-sm text-stone-600">Signed in as {session.user.email ?? "No email"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
