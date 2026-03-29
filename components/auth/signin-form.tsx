"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function routeByRole(role?: string) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "PROVIDER") return "/dashboard/provider";
  return "/dashboard/user";
}

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCredentialSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        try {
          const precheck = await fetch("/api/auth/provider-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const precheckPayload = await precheck.json();
          if (precheckPayload?.pendingApproval) {
            setError("Your provider account is pending admin approval.");
            return;
          }
        } catch {
          // Fall back to generic message if precheck fails.
        }

        setError("Invalid email or password.");
        return;
      }

      const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
      const session = await sessionResponse.json();
      router.push(routeByRole(session?.user?.role));
      router.refresh();
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (result?.error) {
        setError("Google sign in is not available right now. Check Google OAuth settings.");
        return;
      }

      if (result?.url) {
        router.push(result.url);
        router.refresh();
        return;
      }

      setError("Google sign in could not be started. Please try again.");
    } catch {
      setError("Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCredentialSignIn} className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold text-stone-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="abc@gmail.com"
            required
            className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold text-stone-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
          />
        </div>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-(--brand) px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in with Credentials"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 disabled:opacity-60"
      >
        Continue with Google
      </button>
    </div>
  );
}
