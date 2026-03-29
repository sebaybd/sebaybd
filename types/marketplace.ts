export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type ProblemSize = "SMALL" | "MEDIUM" | "BIG";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  parentSlug?: string;
}

export interface ProviderSummary {
  id: string;
  name: string;
  title: string;
  division: string;
  district: string;
  area: string;
  rating: number;
  reviewCount: number;
  approved: boolean;
  image: string;
}

export interface ServiceSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  categorySlug: string;
  providerId: string;
  priceFrom: number;
  priceTo?: number;
  division: string;
  district: string;
  area: string;
  latitude?: number;
  longitude?: number;
  supportedProblemSizes?: ProblemSize[];
  tags: string[];
  image: string;
}

export interface DailyEssentialProblem {
  id: string;
  title: string;
  description: string;
  categorySlug: string;
  problemSize: ProblemSize;
  localContext: string;
  commonAreas: string[];
}

export interface BookingSummary {
  id: string;
  serviceId: string;
  customerName: string;
  providerName: string;
  scheduledAt: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  problemText: string;
}

export interface MessageSummary {
  id: string;
  bookingId?: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
}

export interface ReviewSummary {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface MockStoreData {
  categories: ServiceCategory[];
  providers: ProviderSummary[];
  services: ServiceSummary[];
  essentialProblems: DailyEssentialProblem[];
  bookings: BookingSummary[];
  messages: MessageSummary[];
  reviews: ReviewSummary[];
}
