import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sampleCategories } from "@/lib/sample-data";
import { shouldUseSampleData } from "@/lib/data-source";
import { readMockStore } from "@/lib/mock-store";

export async function GET() {
  if (shouldUseSampleData()) {
    return NextResponse.json({ data: readMockStore().categories ?? sampleCategories });
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ parentId: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        parent: {
          select: {
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: categories.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        parentSlug: item.parent?.slug,
      })),
    });
  } catch {
    return NextResponse.json({ data: sampleCategories });
  }
}
