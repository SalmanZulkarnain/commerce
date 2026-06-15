import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    categoryId: z.coerce.number().int().positive(),
    description: z.string(),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    weight: z.coerce.number().int().positive()
})

export type ProductInput = z.infer<typeof productSchema>;