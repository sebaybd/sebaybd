"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface BookingFormProps {
  serviceId: string;
  providerId: string;
  serviceName: string;
  priceFrom: number;
  priceTo?: number;
}

export function BookingForm({
  serviceId,
  providerId,
  serviceName,
  priceFrom,
  priceTo,
}: BookingFormProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    problemDescription: "",
    scheduledDate: "",
    scheduledTime: "",
    locationNote: "",
    budget: priceFrom.toString(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call for booking
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          providerId,
          problemText: formData.problemDescription,
          scheduledAt: new Date(`${formData.scheduledDate}T${formData.scheduledTime}`),
          locationNote: formData.locationNote,
          quotedPrice: parseFloat(formData.budget),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = "/dashboard/user";
        }, 2000);
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-stone-700 mb-4">Please sign in to book this service</p>
        <Link
          href="/signin"
          className="inline-block rounded-lg bg-(--brand) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand)/90"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-lg font-bold text-green-900">Booking Submitted!</h3>
        <p className="text-sm text-green-700 mt-2">We'll redirect you to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h2 className="text-2xl font-bold mb-2">Book This Service</h2>
      <p className="text-stone-600 mb-6">Estimated price: ৳ {priceFrom} {priceTo ? `- ৳ ${priceTo}` : ""}</p>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s}>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                s === step
                  ? "bg-(--brand) text-white"
                  : s < step
                    ? "bg-green-500 text-white"
                    : "bg-stone-200 text-stone-600"
              }`}
            >
              {s < step ? "✓" : s}
            </div>
            {s < 3 && <div className={`h-1 w-12 ${s < step ? "bg-green-500" : "bg-stone-200"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Problem Description */}
        {step === 1 && (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Describe your problem or requirement *
            </label>
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
              placeholder="Example: My air conditioner stopped cooling. Only making noise..."
              required
            />
            <p className="text-xs text-stone-500 mt-2">
              {formData.problemDescription.length}/500 characters
            </p>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Preferred Date *</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Preferred Time *</label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Location / Address Note</label>
              <input
                type="text"
                name="locationNote"
                value={formData.locationNote}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 px-4 py-2 text-stone-900 placeholder-stone-400 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
                placeholder="e.g., Office in Mirpur, Apartment 5B"
              />
            </div>
          </div>
        )}

        {/* Step 3: Budget & Confirm */}
        {step === 3 && (
          <div className="space-y-4 rounded-lg bg-stone-50 p-4 border border-stone-200">
            <h3 className="font-semibold text-stone-900">Booking Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Service:</span>
                <span className="font-semibold">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Date:</span>
                <span className="font-semibold">{new Date(formData.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Time:</span>
                <span className="font-semibold">{formData.scheduledTime}</span>
              </div>
              {formData.locationNote && (
                <div className="flex justify-between">
                  <span className="text-stone-600">Location:</span>
                  <span className="font-semibold">{formData.locationNote}</span>
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 pt-3 mt-3">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Your Budget (৳) *</label>
              <div className="flex items-center gap-2">
                <span className="text-stone-600">৳</span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min={priceFrom}
                  className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-stone-900 focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand)/20"
                  required
                />
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Minimum: ৳ {priceFrom} {priceTo ? `| Maximum: ৳ ${priceTo}` : ""}
              </p>
            </div>

            <p className="text-xs text-stone-600 bg-blue-50 p-2 rounded">
              {" "}
              💡 The service provider will review your booking and may negotiate the final price.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.problemDescription) {
                  alert("Please describe your problem");
                  return;
                }
                if (step === 2 && (!formData.scheduledDate || !formData.scheduledTime)) {
                  alert("Please select date and time");
                  return;
                }
                setStep(step + 1);
              }}
              className="flex-1 rounded-lg bg-(--brand) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand)/90"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-(--brand) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand)/90 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
