import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardEntryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?next=/dashboard");
  }

  if (session.user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (session.user.role === "PROVIDER") {
    redirect("/dashboard/provider");
  }

  redirect("/dashboard/user");
}
