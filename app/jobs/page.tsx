import { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/cards/service-card";
import { readMockStore } from "@/lib/mock-store";
import { getCategoryBnLabel, problemSizeBnLabel } from "@/lib/bn-labels";
import { ProblemSize } from "@/types/marketplace";

interface JobsPageProps {
  searchParams: Promise<{
    district?: string;
    size?: ProblemSize;
  }>;
}

export const metadata: Metadata = {
  title: "Jobs & Opportunities",
  description: "Find part-time jobs and flexible earning opportunities in Bangladesh.",
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const store = readMockStore();
  const selectedDistrict = params.district ?? "all";
  const selectedSize = params.size ?? "all";

  const districts = Array.from(
    new Set(
      store.services
        .filter((service) => service.categorySlug === "part-time-jobs")
        .map((service) => service.district)
    )
  ).sort((a, b) => a.localeCompare(b));

  const jobServices = store.services.filter((service) => {
    if (service.categorySlug !== "part-time-jobs") {
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

  const relatedProblems = store.essentialProblems.filter((problem) => {
    if (problem.categorySlug !== "part-time-jobs") {
      return false;
    }

    if (selectedSize !== "all" && problem.problemSize !== selectedSize) {
      return false;
    }

    return true;
  });

  const createFilterHref = (size: "all" | ProblemSize, district: string) => {
    const query = new URLSearchParams();
    if (size !== "all") {
      query.set("size", size);
    }
    if (district !== "all") {
      query.set("district", district);
    }
    const queryString = query.toString();
    return queryString ? `/jobs?${queryString}` : "/jobs";
  };

  return (
    <section className="container-shell py-8">
      <h1 className="text-3xl font-bold">Jobs & Opportunities</h1>
      <p className="mt-2 text-stone-600">Part-time and flexible opportunities for students, homemakers, and local workers.</p>

      <div className="mt-6 rounded-3xl bg-(--brand) p-6 text-white">
        <h2 className="text-xl font-bold">Part-Time Focus • পার্ট-টাইম ফোকাস</h2>
        <p className="mt-2 text-sm text-white/85">Category: {getCategoryBnLabel("part-time-jobs")} | Find quick earning options with verified providers.</p>
      </div>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">Problem Size:</span>
          <Link
            href={createFilterHref("all", selectedDistrict)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              selectedSize === "all" ? "bg-(--brand) text-white" : "border border-stone-300 text-stone-700"
            }`}
          >
            All
          </Link>
          {(["SMALL", "MEDIUM", "BIG"] as ProblemSize[]).map((size) => (
            <Link
              key={size}
              href={createFilterHref(size, selectedDistrict)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedSize === size ? "bg-(--brand) text-white" : "border border-stone-300 text-stone-700"
              }`}
            >
              {size} ({problemSizeBnLabel[size]})
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">District:</span>
          <Link
            href={createFilterHref(selectedSize, "all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              selectedDistrict === "all" ? "bg-(--accent) text-foreground" : "border border-stone-300 text-stone-700"
            }`}
          >
            All Districts
          </Link>
          {districts.map((district) => (
            <Link
              key={district}
              href={createFilterHref(selectedSize, district)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedDistrict === district ? "bg-(--accent) text-foreground" : "border border-stone-300 text-stone-700"
              }`}
            >
              {district}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      {!jobServices.length ? (
        <p className="mt-4 text-sm text-stone-600">No job services match these filters. Try All Districts or a different size.</p>
      ) : null}

      <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="text-xl font-bold">Common Job-Seeker Problems</h2>
        <div className="mt-4 space-y-3">
          {relatedProblems.map((problem) => (
            <article key={problem.id} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
              <p className="font-semibold">{problem.title}</p>
              <p className="text-sm text-stone-600">{problem.localContext}</p>
              <p className="mt-1 text-xs text-stone-500">
                Size: {problem.problemSize} ({problemSizeBnLabel[problem.problemSize]})
              </p>
              <Link href={`/search?q=${encodeURIComponent(problem.title)}&category=${problem.categorySlug}&size=${problem.problemSize}`} className="mt-2 inline-block text-xs font-semibold text-(--brand)">
                Search matching services
              </Link>
            </article>
          ))}
        </div>
        {!relatedProblems.length ? (
          <p className="mt-4 text-sm text-stone-600">No job-related essential problems found for the selected size.</p>
        ) : null}
      </div>
    </section>
  );
}
