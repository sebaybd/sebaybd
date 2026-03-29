import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sampleMessages } from "@/lib/sample-data";
import { prisma } from "@/lib/prisma";
import { shouldUseSampleData } from "@/lib/data-source";
import { readMockStore, updateMockStore } from "@/lib/mock-store";

const messageSchema = z.object({
  bookingId: z.string().optional(),
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  content: z.string().min(1).max(1000),
});

export async function GET(request: NextRequest) {
  const bookingId = request.nextUrl.searchParams.get("bookingId");

  if (!shouldUseSampleData()) {
    try {
      const messages = await prisma.message.findMany({
        where: bookingId ? { bookingId } : undefined,
        include: {
          fromUser: { select: { name: true } },
          toUser: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
        take: 200,
      });

      return NextResponse.json({
        data: messages.map((message: any) => ({
          id: message.id,
          bookingId: message.bookingId ?? undefined,
          from: message.fromUser.name,
          to: message.toUser.name,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        })),
      });
    } catch {
      // Keep local preview alive via fallback sample data.
    }
  }

  const storedMessages = readMockStore().messages ?? sampleMessages;
  const data = bookingId
    ? storedMessages.filter((message) => message.bookingId === bookingId)
    : storedMessages;

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid message payload", errors: parsed.error.issues }, { status: 400 });
  }

  if (shouldUseSampleData()) {
    const message = {
      id: crypto.randomUUID(),
      bookingId: parsed.data.bookingId,
      from: parsed.data.fromUserId,
      to: parsed.data.toUserId,
      content: parsed.data.content,
      createdAt: new Date().toISOString(),
    };

    updateMockStore((store) => ({
      ...store,
      messages: [...store.messages, message],
    }));

    return NextResponse.json(
      {
        message: "Message stored (sample mode)",
        data: message,
      },
      { status: 201 }
    );
  }

  try {
    const message = await prisma.message.create({
      data: {
        bookingId: parsed.data.bookingId,
        fromUserId: parsed.data.fromUserId,
        toUserId: parsed.data.toUserId,
        content: parsed.data.content,
      },
      include: {
        fromUser: { select: { name: true } },
        toUser: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: "Message stored",
        data: {
          id: message.id,
          bookingId: message.bookingId,
          from: message.fromUser.name,
          to: message.toUser.name,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Failed to store message" }, { status: 500 });
  }
}
