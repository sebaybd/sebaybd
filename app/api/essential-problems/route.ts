import { NextRequest, NextResponse } from "next/server";
import { ProblemSize } from "@/types/marketplace";
import { readMockStore } from "@/lib/mock-store";

export async function GET(request: NextRequest) {
  const size = request.nextUrl.searchParams.get("size") as ProblemSize | null;
  const category = request.nextUrl.searchParams.get("category");

  const store = readMockStore();
  const problems = store.essentialProblems.filter((problem) => {
    const sizeMatch = !size || problem.problemSize === size;
    const categoryMatch = !category || problem.categorySlug === category;
    return sizeMatch && categoryMatch;
  });

  return NextResponse.json({ data: problems });
}
