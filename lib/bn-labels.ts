import { ProblemSize } from "@/types/marketplace";

export const problemSizeBnLabel: Record<ProblemSize, string> = {
  SMALL: "ছোট",
  MEDIUM: "মাঝারি",
  BIG: "বড়",
};

const categoryBnMap: Record<string, string> = {
  "home-services": "হোম সার্ভিস",
  plumber: "প্লাম্বার",
  electrician: "ইলেকট্রিশিয়ান",
  "it-services": "আইটি সার্ভিস",
  "repair-services": "রিপেয়ার সার্ভিস",
  education: "শিক্ষা",
  "home-tutor": "হোম টিউটর",
  health: "স্বাস্থ্য",
  "beauty-salon": "বিউটি ও সেলুন",
  transport: "পরিবহন",
  "car-parking": "কার পার্কিং",
  events: "ইভেন্টস",
  "part-time-jobs": "পার্ট-টাইম জব",
  "short-term-services": "স্বল্পমেয়াদী সার্ভিস",
  "short-term-rent": "স্বল্পমেয়াদী ভাড়া",
  "short-term-investment": "স্বল্পমেয়াদী বিনিয়োগ",
};

export function getCategoryBnLabel(slug: string) {
  return categoryBnMap[slug] ?? "সার্ভিস";
}
