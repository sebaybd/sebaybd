import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ providerProfileId: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", errors: parsed.error.issues }, { status: 400 });
  }

  const { providerProfileId } = await context.params;

  try {
    const profile = await prisma.providerProfile.update({
      where: { id: providerProfileId },
      data: {
        status: parsed.data.status,
        verified: parsed.data.status === "APPROVED",
      },
      select: {
        id: true,
        status: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (parsed.data.status === "APPROVED") {
      await prisma.user.update({
        where: { id: profile.user.id },
        data: { role: "PROVIDER" },
      });
    }

    return NextResponse.json({
      message: parsed.data.status === "APPROVED" ? "Provider approved." : "Provider rejected.",
      data: profile,
    });
  } catch {
    return NextResponse.json({ message: "Failed to update provider status." }, { status: 500 });
  }
}
