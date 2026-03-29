import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { shouldUseSampleData } from "@/lib/data-source";
import { readMockStore } from "@/lib/mock-store";
import { findServicesByProblem } from "@/lib/problem-matcher";
import { ProblemSize } from "@/types/marketplace";

const querySchema = z.object({
  q: z.string().min(2),
  location: z.string().optional(),
  problemSize: z.enum(["SMALL", "MEDIUM", "BIG"]).optional(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? "",
    location: searchParams.get("location") ?? undefined,
    problemSize: (searchParams.get("problemSize") as ProblemSize | null) ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Query must be at least 2 characters" }, { status: 400 });
  }

  const result = shouldUseSampleData()
    ? findServicesByProblem(parsed.data.q, parsed.data.location, parsed.data.problemSize, readMockStore())
    : findServicesByProblem(parsed.data.q, parsed.data.location, parsed.data.problemSize);
  return NextResponse.json(result);
}
