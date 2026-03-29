import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sampleServices } from "@/lib/sample-data";
import { distanceKm } from "@/lib/geo";
import { prisma } from "@/lib/prisma";
import { shouldUseSampleData } from "@/lib/data-source";
import { slugify } from "@/lib/slugify";
import { readMockStore, updateMockStore } from "@/lib/mock-store";
import { ProblemSize } from "@/types/marketplace";

const serviceCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categorySlug: z.string().min(1),
  providerId: z.string().min(1),
  priceFrom: z.number().min(0),
  priceTo: z.number().optional(),
  division: z.string().min(2),
  district: z.string().min(2),
  area: z.string().min(2),
  tags: z.array(z.string()).default([]),
  image: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase();
  const category = request.nextUrl.searchParams.get("category");
  const division = request.nextUrl.searchParams.get("division");
  const problemSize = request.nextUrl.searchParams.get("problemSize") as ProblemSize | null;
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));
  const radiusKm = Number(request.nextUrl.searchParams.get("radiusKm") ?? 20);

  const useNearMe = Number.isFinite(lat) && Number.isFinite(lng);

  if (!shouldUseSampleData()) {
    try {
      const services = await prisma.service.findMany({
        where: {
          isActive: true,
          ...(category ? { category: { slug: category } } : {}),
          ...(division ? { division } : {}),
          ...(problemSize ? { supportedProblemSizes: { has: problemSize } } : {}),
          ...(q
            ? {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { tags: { has: q } },
                ],
              }
            : {}),
        },
        include: {
          category: { select: { slug: true } },
          provider: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const mapped = services.map((service: (typeof services)[number]) => ({
        id: service.id,
        title: service.title,
        slug: service.slug,
        description: service.description,
        categorySlug: service.category.slug,
        providerId: service.providerId,
        priceFrom: service.priceFrom,
        priceTo: service.priceTo ?? undefined,
        division: service.division,
        district: service.district,
        area: service.area,
        latitude: service.provider.latitude ?? undefined,
        longitude: service.provider.longitude ?? undefined,
        tags: service.tags,
        image: service.images[0] ?? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      }));

      const nearFiltered = mapped.filter((service) => {
        if (!useNearMe) return true;
        return (
          service.latitude &&
          service.longitude &&
          distanceKm(lat, lng, service.latitude, service.longitude) <= radiusKm
        );
      });

      return NextResponse.json({ data: nearFiltered });
    } catch {
      // Fall through to sample data for local preview resilience.
    }
  }

  const localServices = readMockStore().services ?? sampleServices;
  const filtered = localServices.filter((service) => {
    const queryMatch = !q || service.title.toLowerCase().includes(q) || service.tags.some((tag) => tag.includes(q));
    const categoryMatch = !category || service.categorySlug === category;
    const divisionMatch = !division || service.division === division;
    const sizeMatch = !problemSize || !service.supportedProblemSizes || service.supportedProblemSizes.includes(problemSize);
    const nearMatch =
      !useNearMe ||
      (service.latitude &&
        service.longitude &&
        distanceKm(lat, lng, service.latitude, service.longitude) <= radiusKm);

    return queryMatch && categoryMatch && divisionMatch && sizeMatch && nearMatch;
  });

  return NextResponse.json({ data: filtered });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = serviceCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid service payload", errors: parsed.error.issues }, { status: 400 });
  }

  const payload = parsed.data;
  const slug = slugify(payload.title);

  if (shouldUseSampleData()) {
    const service = {
      id: crypto.randomUUID(),
      title: payload.title,
      slug,
      description: payload.description,
      categorySlug: payload.categorySlug,
      providerId: payload.providerId,
      priceFrom: payload.priceFrom,
      priceTo: payload.priceTo,
      division: payload.division,
      district: payload.district,
      area: payload.area,
      tags: payload.tags,
      image: payload.image ?? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    };

    updateMockStore((store) => ({
      ...store,
      services: [service, ...store.services],
    }));

    return NextResponse.json(
      {
        message: "Service created (sample mode)",
        data: service,
      },
      { status: 201 }
    );
  }

  try {
    const category = await prisma.category.findUnique({
      where: { slug: payload.categorySlug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const service = await prisma.service.create({
      data: {
        title: payload.title,
        slug,
        description: payload.description,
        categoryId: category.id,
        providerId: payload.providerId,
        priceFrom: payload.priceFrom,
        priceTo: payload.priceTo,
        images: payload.image ? [payload.image] : [],
        tags: payload.tags,
        division: payload.division,
        district: payload.district,
        area: payload.area,
      },
      include: { category: { select: { slug: true } } },
    });

    return NextResponse.json(
      {
        message: "Service created",
        data: {
          id: service.id,
          title: service.title,
          slug: service.slug,
          description: service.description,
          categorySlug: service.category.slug,
          providerId: service.providerId,
          priceFrom: service.priceFrom,
          priceTo: service.priceTo ?? undefined,
          division: service.division,
          district: service.district,
          area: service.area,
          tags: service.tags,
          image: service.images[0] ?? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Failed to create service" }, { status: 500 });
  }
}
