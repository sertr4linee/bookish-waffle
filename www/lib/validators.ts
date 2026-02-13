import { z } from "zod";

export const vehicleTypes = [
  "citadine",
  "berline",
  "suv",
  "utilitaire",
  "luxe",
  "cabriolet",
] as const;

export const vehicleSchema = z.object({
  name: z.string().min(2, "Nom requis (min 2 caracteres)"),
  type: z.enum(vehicleTypes, { message: "Type de vehicule invalide" }),
  description: z.string().max(2000).optional().default(""),
  pricePerDay: z.number().int().min(100, "Prix minimum : 1 EUR"),
  address: z.string().min(2, "Adresse requise"),
  lat: z.number().optional(),
  lng: z.number().optional(),
  accessMethod: z.string().max(500).optional().default(""),
});

export const bookingSchema = z.object({
  vehicleId: z.string().uuid(),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Date invalide"),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Date invalide"),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Message vide").max(5000),
});

export const consentSchema = z.object({
  type: z.enum(["tos", "privacy"]),
  version: z.string().min(1),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
