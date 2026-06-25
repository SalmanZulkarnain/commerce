import { z } from "zod";
import { ProductInput } from "./schema";
import { ProductImage } from "@/generated/prisma/client";

export type ProductFormState = {
  errors: z.ZodFlattenedError<ProductInput> | null;
}

export type ExistingImage = {
  type: "existing",
  id: string,
  imageUrl: string,
  publicId: string,
  isPrimary: boolean
}

export type NewImage = {
  type: "new",
  id: string,
  file: File,
  previewUrl: string
}

export type ProductImageState =
  | ExistingImage | NewImage;

export type ProductWithImages = ProductInput & {
  id?: number;
  images: ProductImage[];
};