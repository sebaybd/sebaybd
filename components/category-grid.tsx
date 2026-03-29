import Link from "next/link";
import { sampleCategories } from "@/lib/sample-data";
import { getCategoryBnLabel } from "@/lib/bn-labels";

const rootCategories = sampleCategories.filter((category) => !category.parentSlug);

export function CategoryGrid() {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-bold">Popular Categories</h2>
        <Link href="/search" className="text-sm font-semibold text-(--brand)">
          View all
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rootCategories.map((category, index) => (
          <Link
            key={category.id}
            href={`/search?category=${category.slug}`}
            className="stagger-in rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-1"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <h3 className="font-semibold">{category.name}</h3>
            <p className="mt-1 text-xs font-semibold text-(--accent)">{getCategoryBnLabel(category.slug)}</p>
            <p className="mt-1 text-xs text-stone-600">Explore services and verified providers</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
