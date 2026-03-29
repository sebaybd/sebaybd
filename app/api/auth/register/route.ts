import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]),
    division: z.string().optional(),
    district: z.string().optional(),
    area: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.role === "PROVIDER") {
      if (!value.division?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Division is required for provider", path: ["division"] });
      }
      if (!value.district?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "District is required for provider", path: ["district"] });
      }
      if (!value.area?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Area is required for provider", path: ["area"] });
      }
    }
  });

const adminRegistrationEmail = "sebaybd@gmail.com";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid registration payload", errors: parsed.error.issues }, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  if (parsed.data.role === "ADMIN" && normalizedEmail !== adminRegistrationEmail) {
    return NextResponse.json(
      { message: `Only ${adminRegistrationEmail} can register as admin.` },
      { status: 403 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        passwordHash,
        role: parsed.data.role,
        providerProfile:
          parsed.data.role === "PROVIDER"
            ? {
                create: {
                  status: "PENDING",
                  verified: false,
                  division: parsed.data.division!.trim(),
                  district: parsed.data.district!.trim(),
                  area: parsed.data.area!.trim(),
                },
              }
            : undefined,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const providerPending = parsed.data.role === "PROVIDER";

    return NextResponse.json(
      {
        message: providerPending
          ? "Provider account created. Waiting for admin approval before login."
          : "Account created successfully.",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    const isMongoConnectivityError =
      message.includes("Server selection timeout") ||
      message.includes("ReplicaSetNoPrimary") ||
      message.includes("Raw query failed");

    if (isMongoConnectivityError) {
      return NextResponse.json(
        {
          message:
            "Database connection failed. Please allow your IP in MongoDB Atlas Network Access and try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: "Failed to register account." }, { status: 500 });
  }
}
