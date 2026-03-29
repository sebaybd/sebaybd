"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type RegisterRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

const adminEmail = "sebaybd@gmail.com";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>("CUSTOMER");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isProvider = role === "PROVIDER";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          division: isProvider ? division : undefined,
          district: isProvider ? district : undefined,
          area: isProvider ? area : undefined,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.message ?? "Registration failed.");
        return;
      }

      setMessage(payload.message ?? "Account created successfully.");

      if (role === "PROVIDER") {
        return;
      }

      router.push("/signin");
      router.refresh();
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-stone-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold text-stone-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          minLength={6}
          required
          className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
        />
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-semibold text-stone-700">
          Register As
        </label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value as RegisterRole)}
          className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
        >
          <option value="CUSTOMER">User</option>
          <option value="PROVIDER">Provider</option>
        </select>
        {role === "ADMIN" ? (
          <p className="mt-1 text-xs text-stone-500">Only {adminEmail} can create an admin account.</p>
        ) : null}
      </div>

      {isProvider ? (
        <>
          <div>
            <label htmlFor="division" className="mb-1 block text-sm font-semibold text-stone-700">
              Division
            </label>
            <input
              id="division"
              type="text"
              value={division}
              onChange={(event) => setDivision(event.target.value)}
              required
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
            />
          </div>

          <div>
            <label htmlFor="district" className="mb-1 block text-sm font-semibold text-stone-700">
              District
            </label>
            <input
              id="district"
              type="text"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              required
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
            />
          </div>

          <div>
            <label htmlFor="area" className="mb-1 block text-sm font-semibold text-stone-700">
              Area
            </label>
            <input
              id="area"
              type="text"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              required
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none ring-(--brand) focus:ring"
            />
          </div>
        </>
      ) : null}

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {message ? <p className="text-sm font-medium text-(--brand)">{message}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-(--brand) px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
