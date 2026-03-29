import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { shouldUseSampleData } from "@/lib/data-source";
import { slugify } from "@/lib/slugify";
import { updateMockStore } from "@/lib/mock-store";

const serviceUpdateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categorySlug: z.string().min(1),
  priceFrom: z.number().min(0),
  priceTo: z.number().optional(),
  division: z.string().min(2),
  district: z.string().min(2),
  area: z.string().min(2),
  tags: z.array(z.string()).default([]),
  image: z.string().url().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const { serviceId } = await params;
  const body = await request.json();
  const parsed = serviceUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid service payload", errors: parsed.error.issues }, { status: 400 });
  }

  if (shouldUseSampleData()) {
    const updated = {
      id: serviceId,
      slug: slugify(parsed.data.title),
      providerId: "p2",
      title: parsed.data.title,
      description: parsed.data.description,
      categorySlug: parsed.data.categorySlug,
      priceFrom: parsed.data.priceFrom,
      priceTo: parsed.data.priceTo,
      division: parsed.data.division,
      district: parsed.data.district,
      area: parsed.data.area,
      tags: parsed.data.tags,
      image: parsed.data.image ?? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    };

    updateMockStore((store) => ({
      ...store,
      services: store.services.map((service) =>
        service.id === serviceId ? { ...service, ...updated, providerId: service.providerId } : service
      ),
    }));

    return NextResponse.json({
      message: "Service updated (sample mode)",
      data: updated,
    });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { slug: parsed.data.categorySlug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: {
        title: parsed.data.title,
        slug: slugify(parsed.data.title),
        description: parsed.data.description,
        categoryId: category.id,
        priceFrom: parsed.data.priceFrom,
        priceTo: parsed.data.priceTo,
        division: parsed.data.division,
        district: parsed.data.district,
        area: parsed.data.area,
        tags: parsed.data.tags,
        images: parsed.data.image ? [parsed.data.image] : undefined,
      },
      include: { category: { select: { slug: true } } },
    });

    return NextResponse.json({
      message: "Service updated",
      data: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        description: updated.description,
        categorySlug: updated.category.slug,
        providerId: updated.providerId,
        priceFrom: updated.priceFrom,
        priceTo: updated.priceTo ?? undefined,
        division: updated.division,
        district: updated.district,
        area: updated.area,
        tags: updated.tags,
        image: updated.images[0] ?? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to update service" }, { status: 500 });
  }
}
