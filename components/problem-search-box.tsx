"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketplaceState, useMarketplaceStore } from "@/stores/use-marketplace-store";
import { problemSizeBnLabel } from "@/lib/bn-labels";
import { ProblemSize } from "@/types/marketplace";

export function ProblemSearchBox() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [problemSize, setProblemSize] = useState<ProblemSize>("MEDIUM");
  const setQuery = useMarketplaceStore((state: MarketplaceState) => state.setQuery);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(input);
    router.push(`/search?q=${encodeURIComponent(input)}&size=${problemSize}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(["SMALL", "MEDIUM", "BIG"] as ProblemSize[]).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setProblemSize(size)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              problemSize === size ? "bg-(--brand) text-white" : "border border-stone-300 text-stone-700"
            }`}
          >
            {size} ({problemSizeBnLabel[size]})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Example: My AC is not cooling"
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none ring-(--brand) transition focus:ring"
      />
      <button
        type="submit"
        className="rounded-2xl bg-(--brand) px-6 py-3 text-sm font-bold text-white"
      >
        Find Solution
      </button>
      </div>
    </form>
  );
}
