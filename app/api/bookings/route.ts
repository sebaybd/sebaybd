import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sampleBookings } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { shouldUseSampleData } from "@/lib/data-source";
import { readMockStore, updateMockStore } from "@/lib/mock-store";

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  customerId: z.string().min(1),
  providerId: z.string().min(1).optional(),
  scheduledAt: z.string().min(5),
  problemText: z.string().min(5),
  locationNote: z.string().optional(),
  quotedPrice: z.number().optional(),
});

export async function GET() {
  if (shouldUseSampleData()) {
    return NextResponse.json({ data: readMockStore().bookings ?? sampleBookings });
  }

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: { select: { name: true } },
        provider: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      data: bookings.map((booking: any) => ({
        id: booking.id,
        serviceId: booking.serviceId,
        customerName: booking.customer.name,
        providerName: booking.provider.user.name,
        scheduledAt: booking.scheduledAt.toISOString(),
        status: booking.status,
        problemText: booking.problemText,
      })),
    });
  } catch {
    return NextResponse.json({ data: sampleBookings });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid booking payload", errors: parsed.error.issues }, { status: 400 });
  }

  if (shouldUseSampleData()) {
    const service = readMockStore().services.find((item) => item.id === parsed.data.serviceId);
    const provider = readMockStore().providers.find((item) => item.id === (parsed.data.providerId ?? service?.providerId));

    const booking = {
      id: crypto.randomUUID(),
      serviceId: parsed.data.serviceId,
      customerName: parsed.data.customerId,
      providerName: provider?.name ?? "Provider",
      scheduledAt: parsed.data.scheduledAt,
      status: "PENDING" as const,
      problemText: parsed.data.problemText,
    };

    updateMockStore((store) => ({
      ...store,
      bookings: [booking, ...store.bookings],
    }));

    return NextResponse.json(
      {
        message: "Booking created (sample mode)",
        data: booking,
      },
      { status: 201 }
    );
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: parsed.data.serviceId },
      select: { providerId: true },
    });

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    const providerId = parsed.data.providerId ?? service.providerId;

    const booking = await prisma.booking.create({
      data: {
        serviceId: parsed.data.serviceId,
        customerId: parsed.data.customerId,
        providerId,
        problemText: parsed.data.problemText,
        scheduledAt: new Date(parsed.data.scheduledAt),
        locationNote: parsed.data.locationNote,
        quotedPrice: parsed.data.quotedPrice,
      },
    });

    return NextResponse.json(
      {
        message: "Booking created",
        data: {
          id: booking.id,
          status: booking.status,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Failed to create booking" }, { status: 500 });
  }
}
