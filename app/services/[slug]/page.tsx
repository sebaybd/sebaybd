import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { readMockStore } from "@/lib/mock-store";

interface ServiceDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const store = readMockStore();
  const service = store.services.find((item) => item.slug === resolvedParams.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const resolvedParams = await params;
  const store = readMockStore();
  const service = store.services.find((item) => item.slug === resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const provider = store.providers.find((item) => item.id === service.providerId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    areaServed: `${service.area}, ${service.district}, ${service.division}`,
    provider: {
      "@type": "LocalBusiness",
      name: provider?.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      lowPrice: service.priceFrom,
      highPrice: service.priceTo,
    },
  };

  return (
    <section className="container-shell py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-stone-200 bg-white p-5">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl">
            <Image src={service.image} alt={service.title} fill className="object-cover" priority />
          </div>
          <h1 className="mt-5 text-3xl font-bold">{service.title}</h1>
          <p className="mt-3 text-stone-700">{service.description}</p>
          <p className="mt-4 text-lg font-bold text-(--brand)">
            ৳ {service.priceFrom} {service.priceTo ? `- ৳ ${service.priceTo}` : ""}
          </p>
          <p className="mt-1 text-sm text-stone-600">Service area: {service.area}, {service.district}, {service.division}</p>
        </article>

        <aside className="rounded-3xl border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-bold">Provider</h2>
          <p className="mt-3 font-semibold">{provider?.name ?? "Provider"}</p>
          <p className="text-sm text-stone-600">{provider?.title}</p>
          <p className="mt-2 text-sm">⭐ {provider?.rating ?? 0} ({provider?.reviewCount ?? 0} reviews)</p>
          <button className="mt-5 w-full rounded-xl bg-(--brand) px-4 py-3 text-sm font-semibold text-white">
            Book This Service
          </button>
        </aside>
      </div>
    </section>
  );
}
