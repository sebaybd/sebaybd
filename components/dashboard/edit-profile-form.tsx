"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: "",
    city: "",
    bio: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate save
    setTimeout(() => {
      setSaved(true);
      setLoading(false);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
          placeholder="Your full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-600 bg-stone-50 cursor-not-allowed"
        />
        <p className="text-xs text-stone-500 mt-1">Email cannot be changed</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
            placeholder="+880 1234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
            placeholder="Your city"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
          placeholder="Tell us about yourself and what services you're looking for..."
        />
        <p className="text-xs text-stone-500 mt-1">{formData.bio.length}/500</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-(--brand) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand)/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => setFormData({ name: user.name, phone: "", city: "", bio: "" })}
          className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          Reset
        </button>
      </div>

      {saved && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
          <p className="text-sm text-green-700 font-semibold">✓ Profile updated successfully</p>
        </div>
      )}
    </form>
  );
}
