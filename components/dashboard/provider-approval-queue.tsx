"use client";

import { useState, useTransition } from "react";

interface PendingProviderItem {
  providerProfileId: string;
  userId: string;
  name: string;
  email: string;
  division: string;
  district: string;
  area: string;
  createdAt: string;
}

interface ProviderApprovalQueueProps {
  initialItems: PendingProviderItem[];
}

export function ProviderApprovalQueue({ initialItems }: ProviderApprovalQueueProps) {
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateStatus = (providerProfileId: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      setMessage(null);

      const response = await fetch(`/api/admin/providers/${providerProfileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.message ?? "Failed to update provider status.");
        return;
      }

      setItems((current) => current.filter((item) => item.providerProfileId !== providerProfileId));
      setMessage(payload.message ?? "Provider status updated.");
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Provider Approval Queue</h2>
        <span className="text-sm text-stone-500">Approve providers before provider login is allowed</span>
      </div>

      {message ? <p className="mt-3 text-sm text-(--brand)">{message}</p> : null}

      {!items.length ? (
        <p className="mt-4 text-sm text-stone-600">No pending provider applications.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <article key={item.providerProfileId} className="rounded-xl border border-stone-100 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-stone-600">{item.email}</p>
                  <p className="text-xs text-stone-500">
                    {item.area}, {item.district}, {item.division}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => updateStatus(item.providerProfileId, "APPROVED")}
                    className="rounded-full bg-(--brand) px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => updateStatus(item.providerProfileId, "REJECTED")}
                    className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
