"use client";

import { useState, useTransition } from "react";
import { ServiceCard } from "@/components/cards/service-card";
import { sampleCategories } from "@/lib/sample-data";
import { ServiceSummary } from "@/types/marketplace";

interface ProviderServiceManagerProps {
  providerId: string;
  initialServices: ServiceSummary[];
}

interface ServiceFormState {
  id?: string;
  title: string;
  description: string;
  categorySlug: string;
  priceFrom: string;
  priceTo: string;
  division: string;
  district: string;
  area: string;
  tags: string;
  image: string;
}

const emptyState: ServiceFormState = {
  title: "",
  description: "",
  categorySlug: "repair-services",
  priceFrom: "",
  priceTo: "",
  division: "Dhaka",
  district: "Dhaka",
  area: "Uttara",
  tags: "",
  image: "",
};

export function ProviderServiceManager({ providerId, initialServices }: ProviderServiceManagerProps) {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState<ServiceFormState>(emptyState);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      setMessage(null);

      const payload = {
        title: form.title,
        description: form.description,
        categorySlug: form.categorySlug,
        providerId,
        priceFrom: Number(form.priceFrom),
        priceTo: form.priceTo ? Number(form.priceTo) : undefined,
        division: form.division,
        district: form.district,
        area: form.area,
        tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
        image: form.image || undefined,
      };

      const response = await fetch(form.id ? `/api/services/${form.id}` : "/api/services", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message ?? "Failed to save service.");
        return;
      }

      const service = result.data as ServiceSummary;
      setServices((current) => {
        if (form.id) {
          return current.map((item) => (item.id === service.id ? service : item));
        }
        return [service, ...current];
      });
      setForm(emptyState);
      setMessage(result.message ?? "Service saved.");
    });
  };

  const startEdit = (service: ServiceSummary) => {
    setForm({
      id: service.id,
      title: service.title,
      description: service.description,
      categorySlug: service.categorySlug,
      priceFrom: String(service.priceFrom),
      priceTo: service.priceTo ? String(service.priceTo) : "",
      division: service.division,
      district: service.district,
      area: service.area,
      tags: service.tags.join(", "),
      image: service.image,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Service Manager</h2>
          <span className="text-sm text-stone-500">Create or edit service listings</span>
        </div>
        {message ? <p className="mt-3 text-sm text-(--brand)">{message}</p> : null}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Service title" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          <select value={form.categorySlug} onChange={(event) => setForm((current) => ({ ...current, categorySlug: event.target.value }))} className="rounded-xl border border-stone-300 px-3 py-2 text-sm">
            {sampleCategories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Describe the service" className="rounded-xl border border-stone-300 px-3 py-2 text-sm md:col-span-2" rows={4} />
          <input value={form.priceFrom} onChange={(event) => setForm((current) => ({ ...current, priceFrom: event.target.value }))} placeholder="Starting price" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          <input value={form.priceTo} onChange={(event) => setForm((current) => ({ ...current, priceTo: event.target.value }))} placeholder="Max price" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          <input value={form.division} onChange={(event) => setForm((current) => ({ ...current, division: event.target.value }))} placeholder="Division" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          <input value={form.district} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))} placeholder="District" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          <input value={form.area} onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))} placeholder="Area" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          <input value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} placeholder="Tags, comma separated" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
          <input value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="Image URL" className="rounded-xl border border-stone-300 px-3 py-2 text-sm md:col-span-2" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={isPending} onClick={submit} className="rounded-full bg-(--brand) px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {form.id ? "Update Service" : "Create Service"}
          </button>
          {form.id ? (
            <button type="button" onClick={() => setForm(emptyState)} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">
              Cancel Edit
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Published Services</h2>
          <span className="text-sm text-stone-500">Tap edit to update pricing, description, or area</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="space-y-3">
              <ServiceCard service={service} />
              <button type="button" onClick={() => startEdit(service)} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700">
                Edit Service
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
