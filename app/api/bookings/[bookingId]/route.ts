import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { shouldUseSampleData } from "@/lib/data-source";
import { updateMockStore } from "@/lib/mock-store";

const bookingStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;
  const body = await request.json();
  const parsed = bookingStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid booking status payload" }, { status: 400 });
  }

  if (shouldUseSampleData()) {
    updateMockStore((store) => ({
      ...store,
      bookings: store.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: parsed.data.status } : booking
      ),
    }));

    return NextResponse.json({
      message: "Booking status updated (sample mode)",
      data: { id: bookingId, status: parsed.data.status },
    });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ message: "Booking status updated", data: booking });
  } catch {
    return NextResponse.json({ message: "Failed to update booking status" }, { status: 500 });
  }
}
