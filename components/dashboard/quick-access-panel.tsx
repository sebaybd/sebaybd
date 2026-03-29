"use client";

import Link from "next/link";

export function QuickAccessPanel() {
  const quickActions = [
    { href: "/search", icon: "🔍", label: "Find Services", color: "bg-blue-100 text-blue-700" },
    { href: "/bookings", icon: "📅", label: "My Bookings", color: "bg-purple-100 text-purple-700" },
    { href: "/messages", icon: "💬", label: "Messages", color: "bg-green-100 text-green-700" },
    { href: "/dashboard/user/profile", icon: "👤", label: "My Profile", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} rounded-lg px-3 py-4 text-center text-sm font-semibold hover:shadow-md transition-shadow`}
          >
            <div className="text-2xl mb-1">{action.icon}</div>
            <div className="text-xs">{action.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
