import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sampleBookings } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { shouldUseSampleData } from "@/lib/data-source";
import { readMockStore, updateMockStore } from "@/lib/mock-store";

const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid review payload", errors: parsed.error.issues }, { status: 400 });
  }

  if (!shouldUseSampleData()) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: parsed.data.bookingId },
        include: { review: true },
      });

      if (!booking || booking.status !== "COMPLETED") {
        return NextResponse.json(
          { message: "Only completed bookings can be reviewed" },
          { status: 403 }
        );
      }

      if (booking.review) {
        return NextResponse.json({ message: "Booking already reviewed" }, { status: 409 });
      }

      await prisma.review.create({
        data: {
          bookingId: booking.id,
          customerId: booking.customerId,
          providerId: booking.providerId,
          serviceId: booking.serviceId,
          rating: parsed.data.rating,
          comment: parsed.data.comment,
        },
      });

      return NextResponse.json({ message: "Review submitted successfully" }, { status: 201 });
    } catch {
      return NextResponse.json({ message: "Failed to submit review" }, { status: 500 });
    }
  }

  const store = readMockStore();
  const booking = store.bookings.find((item) => item.id === parsed.data.bookingId) ?? sampleBookings.find((item) => item.id === parsed.data.bookingId);
  if (!booking || booking.status !== "COMPLETED") {
    return NextResponse.json(
      { message: "Only completed bookings can be reviewed" },
      { status: 403 }
    );
  }

  if (store.reviews.some((review) => review.bookingId === parsed.data.bookingId)) {
    return NextResponse.json({ message: "Booking already reviewed" }, { status: 409 });
  }

  updateMockStore((current) => ({
    ...current,
    reviews: [
      ...current.reviews,
      {
        id: crypto.randomUUID(),
        bookingId: parsed.data.bookingId,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        createdAt: new Date().toISOString(),
      },
    ],
  }));

  return NextResponse.json({ message: "Review submitted successfully" }, { status: 201 });
}
