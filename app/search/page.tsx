import { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/cards/service-card";
import { ProviderCard } from "@/components/cards/provider-card";
import { readMockStore } from "@/lib/mock-store";
import { findServicesByProblem } from "@/lib/problem-matcher";
import { sampleServices } from "@/lib/sample-data";
import { getCategoryBnLabel, problemSizeBnLabel } from "@/lib/bn-labels";
import { ProblemSize } from "@/types/marketplace";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    size?: ProblemSize;
  }>;
}

export const metadata: Metadata = {
  title: "Search Services",
  description: "Find relevant providers by describing your daily problem.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const store = readMockStore();
  const selectedSize = params.size;

  const matched = query
    ? findServicesByProblem(query, params.location, selectedSize, store)
    : {
        category: undefined,
        services: store.services.length ? store.services : sampleServices,
        providers: store.providers,
        detectedProblemSize: selectedSize ?? "MEDIUM",
      };

  const services = params.category
    ? matched.services.filter((service) => service.categorySlug === params.category)
    : matched.services;

  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Problem Search Results</h1>
      <p className="mt-2 text-stone-600">
        {query ? `Showing best matches for: "${query}"` : "Try typing a specific problem to get better matches."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["SMALL", "MEDIUM", "BIG"] as ProblemSize[]).map((size) => (
          <Link
            key={size}
            href={`/search?${new URLSearchParams({
              ...(query ? { q: query } : {}),
              ...(params.location ? { location: params.location } : {}),
              size,
            }).toString()}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              (selectedSize ?? matched.detectedProblemSize) === size
                ? "bg-(--brand) text-white"
                : "border border-stone-300 text-stone-700"
            }`}
          >
            {size} ({problemSizeBnLabel[size]})
          </Link>
        ))}
      </div>

      {matched.category ? (
        <div className="mt-4 inline-flex rounded-full bg-(--brand) px-3 py-1 text-xs font-semibold text-white">
          Detected Category: {matched.category.name}
        </div>
      ) : null}

      <div className="mt-3 inline-flex rounded-full border border-(--accent) px-3 py-1 text-xs font-semibold text-stone-700">
        Problem Size: {matched.detectedProblemSize} ({problemSizeBnLabel[matched.detectedProblemSize]})
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-bold">Matching Providers</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {matched.providers.length
          ? matched.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)
          : <p className="text-stone-600">No provider match found for this query yet.</p>}
      </div>

      <div className="mt-12 rounded-3xl border border-stone-200 bg-white p-6">
        <h2 className="text-2xl font-bold">Daily Essential Problems in Bangladesh</h2>
        <p className="mt-2 text-sm text-stone-600">Local demand signals grouped by real user pain points.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {store.essentialProblems.slice(0, 6).map((problem) => (
            <article key={problem.id} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <p className="text-xs font-semibold text-(--accent)">
                {problem.problemSize} ({problemSizeBnLabel[problem.problemSize]}) PROBLEM
              </p>
              <h3 className="mt-2 font-bold">{problem.title}</h3>
              <p className="mt-1 text-xs text-stone-500">Category: {getCategoryBnLabel(problem.categorySlug)}</p>
              <p className="mt-2 text-sm text-stone-600">{problem.localContext}</p>
              <Link
                href={`/search?q=${encodeURIComponent(problem.title)}&category=${problem.categorySlug}&size=${problem.problemSize}`}
                className="mt-3 inline-block text-xs font-semibold text-(--brand)"
              >
                Find Related Services
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
