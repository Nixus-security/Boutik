import { z } from "zod";
import { borderIdSchema, shapeIdSchema, themeIdSchema } from "@/lib/catalogue-themes";

export const productInputSchema = z.object({
  name: z.string().trim().min(1, "Nom manquant").max(120, "Nom trop long"),
  price: z.number().finite().positive("Prix invalide").max(100_000_000),
  stock: z.number().int().min(0, "Stock invalide").max(1_000_000),
  category: z.string().trim().max(60).nullable(),
  photo_url: z.string().trim().max(400_000, "Photo trop volumineuse").nullable(),
});

export const orderItemInputSchema = z.object({
  product_id: z.string().nullable(),
  product_name: z.string().trim().min(1).max(120),
  quantity: z.number().int().positive().max(10_000),
  unit_price: z.number().finite().nonnegative().max(100_000_000),
});

export const orderInputSchema = z.object({
  client_name: z.string().trim().min(1, "Nom du client requis").max(120),
  client_phone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone trop court")
    .max(25, "Numéro de téléphone trop long")
    .regex(/^[\d+()\s.-]+$/, "Numéro de téléphone invalide"),
  status: z.enum(["en_attente", "paye", "impaye"]),
  payment_method: z.enum(["mobile_money", "cash"]),
  items: z.array(orderItemInputSchema).min(1, "Ajoute au moins un produit"),
});

export const catalogueItemSchema = z.object({
  name: z.string().trim().min(1).max(80),
  price: z.number().finite().nonnegative().max(100_000_000),
  photo: z.string().trim().max(400_000).nullable().optional(),
});

export const catalogueItemsSchema = z.array(catalogueItemSchema).max(24);

export const catalogueLogoSchema = z
  .string()
  .regex(/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/]+=*$/, "Format de logo invalide")
  .max(300_000, "Le logo est trop volumineux");

export const catalogueRequestSchema = z.object({
  format: z.enum(["story", "liste"]).default("story"),
  theme: themeIdSchema.default("vert"),
  shape: shapeIdSchema.default("arrondi"),
  border: borderIdSchema.default("aucune"),
  business: z.string().trim().max(60).default("Ma boutique"),
  currency: z.string().trim().max(10).default("FCFA"),
  items: catalogueItemsSchema,
  logo: catalogueLogoSchema.nullable().optional(),
});

export const emailSchema = z.string().trim().min(1, "Email requis").email("Email invalide");
export const passwordSchema = z.string().min(6, "6 caractères minimum").max(72);

export const signupSchema = z.object({
  businessName: z.string().trim().min(1, "Nom de la boutique requis").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
});
