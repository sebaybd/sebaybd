"use client";

import { useState } from "react";

interface EditProviderProfileFormProps {
  user: {
    name: string;
    email: string;
  };
}

export function EditProviderProfileForm({ user }: EditProviderProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: "",
    title: "Professional Service Provider",
    bio: "",
    division: "",
    district: "",
    area: "",
    hourlyRate: "",
    specializations: "",
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
        <label className="block text-sm font-semibold text-stone-700 mb-2">Business Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
          placeholder="Your business or name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Professional Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
          placeholder="e.g., Electrician, Plumber, Tutor"
        />
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
          <label className="block text-sm font-semibold text-stone-700 mb-2">Hourly Rate (৳)</label>
          <input
            type="number"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
            placeholder="500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Division</label>
          <input
            type="text"
            name="division"
            value={formData.division}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
            placeholder="e.g., Dhaka"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
            placeholder="e.g., Dhaka District"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Area</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
            placeholder="e.g., Mirpur"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Professional Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={5}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
          placeholder="Describe your experience, expertise, and what makes you unique..."
        />
        <p className="text-xs text-stone-500 mt-1">{formData.bio.length}/1000</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Specializations</label>
        <input
          type="text"
          name="specializations"
          value={formData.specializations}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
          placeholder="e.g., AC Repair, Installation, Maintenance (comma-separated)"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-(--brand) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand)/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
        <button
          type="button"
          onClick={() =>
            setFormData({
              name: user.name,
              phone: "",
              title: "Professional Service Provider",
              bio: "",
              division: "",
              district: "",
              area: "",
              hourlyRate: "",
              specializations: "",
            })
          }
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
