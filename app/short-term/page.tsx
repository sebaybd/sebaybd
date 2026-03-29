import { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/cards/service-card";
import { readMockStore } from "@/lib/mock-store";
import { getCategoryBnLabel, problemSizeBnLabel } from "@/lib/bn-labels";
import { ProblemSize } from "@/types/marketplace";

interface ShortTermPageProps {
  searchParams: Promise<{
    district?: string;
    size?: ProblemSize;
    category?: (typeof shortTermSlugs)[number] | "all";
  }>;
}

export const metadata: Metadata = {
  title: "Short-Term Hub",
  description: "Discover short-term rent and investment support services.",
};

const shortTermSlugs = ["short-term-rent", "short-term-investment"];

export default async function ShortTermPage({ searchParams }: ShortTermPageProps) {
  const params = await searchParams;
  const store = readMockStore();
  const selectedDistrict = params.district ?? "all";
  const selectedSize = params.size ?? "all";
  const selectedCategory = params.category ?? "all";

  const shortTermSource = store.services.filter((service) => shortTermSlugs.includes(service.categorySlug));
  const districts = Array.from(new Set(shortTermSource.map((service) => service.district))).sort((a, b) => a.localeCompare(b));

  const shortTermServices = shortTermSource.filter((service) => {
    if (selectedCategory !== "all" && service.categorySlug !== selectedCategory) {
      return false;
    }

    if (selectedDistrict !== "all" && service.district !== selectedDistrict) {
      return false;
    }

    if (selectedSize !== "all") {
      return service.supportedProblemSizes?.includes(selectedSize) ?? false;
    }

    return true;
  });

  const shortTermProblems = store.essentialProblems.filter((problem) => {
    if (!shortTermSlugs.includes(problem.categorySlug)) {
      return false;
    }

    if (selectedCategory !== "all" && problem.categorySlug !== selectedCategory) {
      return false;
    }

    if (selectedSize !== "all" && problem.problemSize !== selectedSize) {
      return false;
    }

    return true;
  });

  const createFilterHref = ({
    size,
    district,
    category,
  }: {
    size: "all" | ProblemSize;
    district: string;
    category: "all" | (typeof shortTermSlugs)[number];
  }) => {
    const query = new URLSearchParams();
    if (size !== "all") {
      query.set("size", size);
    }
    if (district !== "all") {
      query.set("district", district);
    }
    if (category !== "all") {
      query.set("category", category);
    }
    const queryString = query.toString();
    return queryString ? `/short-term?${queryString}` : "/short-term";
  };

  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Short-Term Service Hub</h1>
      <p className="mt-2 text-stone-600">Temporary rent, short period financial planning, and fast arrangement support.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-bold">{getCategoryBnLabel("short-term-rent")}</h2>
          <p className="mt-2 text-sm text-stone-600">Find monthly temporary rooms, family rent, bachelor rent, or office setup.</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-bold">{getCategoryBnLabel("short-term-investment")}</h2>
          <p className="mt-2 text-sm text-stone-600">Get guidance on low-risk short-term local investment options.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">Category:</span>
          <Link
            href={createFilterHref({ size: selectedSize, district: selectedDistrict, category: "all" })}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              selectedCategory === "all" ? "bg-(--brand) text-white" : "border border-stone-300 text-stone-700"
            }`}
          >
            All
          </Link>
          {shortTermSlugs.map((slug) => (
            <Link
              key={slug}
              href={createFilterHref({
                size: selectedSize,
                district: selectedDistrict,
                category: slug,
              })}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedCategory === slug ? "bg-(--brand) text-white" : "border border-stone-300 text-stone-700"
              }`}
            >
              {getCategoryBnLabel(slug)}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">Problem Size:</span>
          <Link
            href={createFilterHref({ size: "all", district: selectedDistrict, category: selectedCategory })}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              selectedSize === "all" ? "bg-(--accent) text-foreground" : "border border-stone-300 text-stone-700"
            }`}
          >
            All
          </Link>
          {(["SMALL", "MEDIUM", "BIG"] as ProblemSize[]).map((size) => (
            <Link
              key={size}
              href={createFilterHref({ size, district: selectedDistrict, category: selectedCategory })}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedSize === size ? "bg-(--accent) text-foreground" : "border border-stone-300 text-stone-700"
              }`}
            >
              {size} ({problemSizeBnLabel[size]})
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">District:</span>
          <Link
            href={createFilterHref({ size: selectedSize, district: "all", category: selectedCategory })}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              selectedDistrict === "all" ? "border-(--brand) border text-(--brand)" : "border border-stone-300 text-stone-700"
            }`}
          >
            All Districts
          </Link>
          {districts.map((district) => (
            <Link
              key={district}
              href={createFilterHref({ size: selectedSize, district, category: selectedCategory })}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedDistrict === district ? "border-(--brand) border text-(--brand)" : "border border-stone-300 text-stone-700"
              }`}
            >
              {district}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shortTermServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      {!shortTermServices.length ? (
        <p className="mt-4 text-sm text-stone-600">No short-term services match these filters right now.</p>
      ) : null}

      <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="text-xl font-bold">Local Short-Term Needs</h2>
        <div className="mt-4 space-y-3">
          {shortTermProblems.map((problem) => (
            <article key={problem.id} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
              <p className="font-semibold">{problem.title}</p>
              <p className="text-sm text-stone-600">{problem.localContext}</p>
              <p className="mt-1 text-xs text-stone-500">
                Size: {problem.problemSize} ({problemSizeBnLabel[problem.problemSize]})
              </p>
              <Link href={`/search?q=${encodeURIComponent(problem.title)}&category=${problem.categorySlug}&size=${problem.problemSize}`} className="mt-2 inline-block text-xs font-semibold text-(--brand)">
                Explore providers
              </Link>
            </article>
          ))}
        </div>
        {!shortTermProblems.length ? (
          <p className="mt-4 text-sm text-stone-600">No short-term problems match the current filters.</p>
        ) : null}
      </div>
    </section>
  );
}
