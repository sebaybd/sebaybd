"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface UserMenuDropdownProps {
  session: Session;
}

export function UserMenuDropdown({ session }: UserMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirectTo: "/" });
  };

  const roleLabel = session.user?.role === "PROVIDER" ? "Provider" : "User";
  const profileHref = session.user?.role === "PROVIDER" ? "/dashboard/provider/profile" : "/dashboard/user/profile";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
      >
        <span className="h-6 w-6 rounded-full bg-(--brand) flex items-center justify-center text-white text-xs font-bold">
          {session.user?.name?.charAt(0).toUpperCase() || "U"}
        </span>
        <span className="hidden sm:inline">{session.user?.name || "User"}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 bg-white shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-900">{session.user?.name}</p>
            <p className="text-xs text-stone-600">{session.user?.email}</p>
            <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold bg-(--brand)/10 text-(--brand) rounded-full">
              {roleLabel}
            </span>
          </div>

          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            📊 Dashboard
          </Link>

          <Link
            href={profileHref}
            className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            👤 My Profile
          </Link>

          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            ⚙️ Settings
          </Link>

          <Link
            href="/messages"
            className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            onClick={() => setIsOpen(false)}
          >
            💬 Messages
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-stone-100 mt-2"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
