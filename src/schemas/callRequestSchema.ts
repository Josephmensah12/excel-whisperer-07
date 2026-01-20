import { z } from "zod";

export const callRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  shipFromCity: z.string().min(2, "Ship from city must be at least 2 characters"),
  shipFromCityCustom: z.string().optional(),
  shipToCity: z.string().min(2, "Ship to city must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type CallRequestFormData = z.infer<typeof callRequestSchema>;