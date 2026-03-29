import Link from "next/link";
import { auth } from "@/auth";
import { UserMenuDropdown } from "./user-menu-dropdown";

const navItems = [
  { href: "/search", label: "Find Services" },
  { href: "/jobs", label: "Jobs" },
  { href: "/short-term", label: "Short-Term" },
  { href: "/providers", label: "Providers" },
  { href: "/bookings", label: "Bookings" },
  { href: "/messages", label: "Messages" },
  // { href: "/admin", label: "Admin" },
];

export async function Header() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-(--surface)/90 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-3">
        <Link href="/" className="font-mono text-lg font-bold tracking-tight text-(--brand)">
          SebayBD
        </Link>
        <nav className="hidden gap-6 text-sm font-semibold text-stone-700 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-(--brand)">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated && session ? (
            <UserMenuDropdown session={session} />
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full border border-stone-300 px-4 py-2 text-xs font-bold tracking-wide text-stone-700"
              >
                Register
              </Link>
              <Link
                href="/signin"
                className="rounded-full bg-(--brand) px-4 py-2 text-xs font-bold tracking-wide text-white!"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
