import Link from "next/link";
import { ProblemSearchBox } from "@/components/problem-search-box";
import { CategoryGrid } from "@/components/category-grid";
import { dailyEssentialProblems, sampleServices } from "@/lib/sample-data";
import { getCategoryBnLabel, problemSizeBnLabel } from "@/lib/bn-labels";

export default function Home() {
  return (
    <section className="container-shell py-8 md:py-14">
      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="hero-fade-up rounded-3xl glass-card p-6 md:p-10">
          <span className="inline-flex rounded-full bg-(--brand) px-3 py-1 text-xs font-bold tracking-wider text-white">
            BANGLADESH PROBLEM TO SOLUTION PLATFORM
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
            Say the problem. Get the right service near you.
          </h1>
          <p className="mt-4 max-w-2xl text-(--muted)">
            From home repair to tutoring, SebayBD maps daily problems to verified providers across division, district, and area.
          </p>
          <div className="mt-7">
            <ProblemSearchBox />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="rounded-full bg-(--accent) px-5 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
            >
              Explore Services
            </Link>
            <Link
              href="/jobs"
              className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700"
            >
              Jobs | চাকরি
            </Link>
            <Link
              href="/short-term"
              className="rounded-full border border-stone-300 px-5 py-2 text-sm font-semibold text-stone-700"
            >
              Short-Term | স্বল্পমেয়াদী
            </Link>
            <Link
              href="/dashboard/provider"
              className="rounded-full border border-(--brand) px-5 py-2 text-sm font-semibold text-(--brand)"
            >
              Become a Provider
            </Link>
          </div>
        </div>

        <aside className="stagger-in rounded-3xl bg-(--brand) p-6 text-white [animation-delay:120ms] md:p-8">
          <h2 className="text-xl font-bold">Trending Needs This Week</h2>
          <ul className="mt-4 space-y-3 text-sm/6">
            {sampleServices.slice(0, 5).map((service) => (
              <li key={service.id} className="rounded-xl border border-white/25 px-3 py-2">
                {service.title}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="mt-10">
        <CategoryGrid />
      </div>

      <div className="mt-10 rounded-3xl bg-white/80 p-6 shadow-sm">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            "Describe your problem naturally",
            "Get matched services and providers",
            "Book, chat, track, and review",
          ].map((step, index) => (
            <div key={step} className="rounded-2xl border border-stone-200 bg-white p-4">
              <p className="font-mono text-sm text-(--accent)">Step {index + 1}</p>
              <p className="mt-2 font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold">Daily Essential Problem Board</h2>
          <Link href="/search" className="text-sm font-semibold text-(--brand)">
            Explore full marketplace
          </Link>
        </div>
        <p className="mt-2 text-sm text-stone-600">
          Designed around local user demand: small, medium, and big real-life issues in Bangladesh.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dailyEssentialProblems.map((problem) => (
            <article key={problem.id} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <p className="text-xs font-semibold text-(--accent)">
                {problem.problemSize} ({problemSizeBnLabel[problem.problemSize]}) PROBLEM
              </p>
              <h3 className="mt-2 font-bold">{problem.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{problem.description}</p>
              <p className="mt-1 text-xs text-stone-500">Category: {getCategoryBnLabel(problem.categorySlug)}</p>
              <p className="mt-2 text-xs text-stone-500">Common areas: {problem.commonAreas.join(", ")}</p>
              <Link
                href={`/search?q=${encodeURIComponent(problem.title)}&category=${problem.categorySlug}&size=${problem.problemSize}`}
                className="mt-3 inline-block text-xs font-semibold text-(--brand)"
              >
                Match this problem
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
