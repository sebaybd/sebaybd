"use server";

import { z } from "zod";

const bookingFormSchema = z.object({
  serviceId: z.string().min(1),
  scheduledAt: z.string().min(5),
  problemText: z.string().min(5),
});

export async function createBookingAction(formData: FormData) {
  const parsed = bookingFormSchema.safeParse({
    serviceId: formData.get("serviceId"),
    scheduledAt: formData.get("scheduledAt"),
    problemText: formData.get("problemText"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid booking form",
      errors: parsed.error.flatten(),
    };
  }

  return {
    ok: true,
    message: "Booking request submitted",
    data: parsed.data,
  };
}
