import Image from "next/image";
import { ProviderSummary } from "@/types/marketplace";

interface ProviderCardProps {
  provider: ProviderSummary;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-full">
          <Image src={provider.image} alt={provider.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-bold">{provider.name}</h3>
          <p className="text-sm text-stone-600">{provider.title}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-stone-100 px-2 py-1">⭐ {provider.rating} ({provider.reviewCount})</span>
        <span className="rounded-full bg-stone-100 px-2 py-1">{provider.area}, {provider.district}</span>
      </div>
    </article>
  );
}
