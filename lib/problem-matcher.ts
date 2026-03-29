import { sampleCategories, sampleProviders, sampleServices } from "@/lib/sample-data";
import { ProblemSize, ProviderSummary, ServiceCategory, ServiceSummary } from "@/types/marketplace";

interface ProblemMatcherCatalog {
  categories: ServiceCategory[];
  providers: ProviderSummary[];
  services: ServiceSummary[];
}

const categoryKeywordMap: Record<string, string[]> = {
  "repair-services": ["repair", "broken", "not working", "ac", "fridge", "fan"],
  electrician: ["electric", "wiring", "switch", "light", "short circuit"],
  plumber: ["water", "leak", "pipe", "tap", "drain"],
  education: ["tutor", "teacher", "exam", "math", "science", "coaching"],
  "home-tutor": ["home tutor", "tuition", "private tutor", "school tutor", "coaching"],
  health: ["doctor", "nurse", "physio", "therapy"],
  "beauty-salon": ["salon", "makeup", "bridal", "beauty"],
  transport: ["car", "pickup", "delivery", "transport"],
  "car-parking": ["car parking", "parking", "garage", "parking slot"],
  events: ["event", "wedding", "photography", "decor"],
  "it-services": ["website", "app", "software", "computer", "it"],
  "part-time-jobs": ["part time", "part-time", "job", "shift", "temporary job"],
  "short-term-rent": ["short term rent", "temporary rent", "rent for months", "month to month"],
  "short-term-investment": ["short term investment", "small investment", "low risk investment", "investment plan"],
};

const problemSizeKeywordMap: Record<ProblemSize, string[]> = {
  SMALL: ["small", "minor", "quick", "simple", "little", "light fix"],
  MEDIUM: ["medium", "normal", "urgent", "soon", "repair", "issue"],
  BIG: ["big", "major", "critical", "emergency", "complete", "full package", "severe"],
};

export function detectProblemSize(problemText: string): ProblemSize {
  const lower = problemText.toLowerCase();

  const scores = (Object.keys(problemSizeKeywordMap) as ProblemSize[]).map((size) => ({
    size,
    score: problemSizeKeywordMap[size].reduce(
      (sum, keyword) => sum + (lower.includes(keyword) ? 1 : 0),
      0
    ),
  }));

  const top = scores.sort((a, b) => b.score - a.score)[0];
  return top?.score ? top.size : "MEDIUM";
}

export function detectCategory(problemText: string, categories: ServiceCategory[] = sampleCategories) {
  const lower = problemText.toLowerCase();

  const scored = Object.entries(categoryKeywordMap).map(([slug, keywords]) => {
    const score = keywords.reduce((sum, keyword) => sum + (lower.includes(keyword) ? 1 : 0), 0);
    return { slug, score };
  });

  const best = scored.sort((a, b) => b.score - a.score)[0];
  const selectedSlug = best?.score ? best.slug : "home-services";
  return categories.find((category) => category.slug === selectedSlug) ?? categories[0];
}

export function findServicesByProblem(
  problemText: string,
  location?: string,
  requestedProblemSize?: ProblemSize,
  catalog: ProblemMatcherCatalog = {
    categories: sampleCategories,
    providers: sampleProviders,
    services: sampleServices,
  }
) {
  const category = detectCategory(problemText, catalog.categories);
  const detectedProblemSize = requestedProblemSize ?? detectProblemSize(problemText);
  const problemLower = problemText.toLowerCase();

  const services = catalog.services.filter((service) => {
    const inCategory =
      service.categorySlug === category.slug ||
      catalog.categories.some(
        (sub) => sub.parentSlug === category.slug && sub.slug === service.categorySlug
      );

    const keywordMatch =
      service.title.toLowerCase().includes(problemLower) ||
      service.tags.some((tag) => problemLower.includes(tag));

    const locationMatch =
      !location ||
      [service.division, service.district, service.area]
        .join(" ")
        .toLowerCase()
        .includes(location.toLowerCase());

    const sizeMatch =
      !service.supportedProblemSizes ||
      service.supportedProblemSizes.includes(detectedProblemSize);

    return (inCategory || keywordMatch) && locationMatch && sizeMatch;
  });

  const providerIds = new Set(services.map((service) => service.providerId));
  const providers = catalog.providers.filter((provider) => providerIds.has(provider.id));

  return { category, services, providers, detectedProblemSize };
}
