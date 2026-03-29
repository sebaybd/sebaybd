import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const payloadSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ pendingApproval: false }, { status: 200 });
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        role: true,
        providerProfile: {
          select: {
            status: true,
          },
        },
      },
    });

    const pendingApproval =
      user?.role === "PROVIDER" && user.providerProfile?.status === "PENDING";

    return NextResponse.json({ pendingApproval }, { status: 200 });
  } catch {
    return NextResponse.json({ pendingApproval: false }, { status: 200 });
  }
}
