import Image from "next/image";
import Link from "next/link";
import { ServiceSummary } from "@/types/marketplace";

interface ServiceCardProps {
  service: ServiceSummary;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
      <div className="relative h-40 w-full overflow-hidden rounded-xl">
        <Image src={service.image} alt={service.title} fill className="object-cover" />
      </div>
      <h3 className="mt-3 line-clamp-1 text-base font-bold">{service.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-stone-600">{service.description}</p>
      {service.supportedProblemSizes?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {service.supportedProblemSizes.map((size) => (
            <span key={size} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
              {size}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-2 text-sm font-semibold text-(--brand)">
        ৳ {service.priceFrom} {service.priceTo ? `- ৳ ${service.priceTo}` : ""}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
        <span>{service.area}, {service.district}</span>
        <Link href={`/services/${service.slug}`} className="font-semibold text-(--accent)">
          Details
        </Link>
      </div>
    </article>
  );
}
