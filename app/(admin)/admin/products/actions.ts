"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { productSchema } from "./schema";
import { z } from "zod";
import { uploadImage } from "@/lib/cloudinary";
import { ProductFormState } from "./types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function saveProductAction(
  prevState: ProductFormState,
  input: {
    formData: FormData;
    files: File[];
  },
): Promise<ProductFormState> {
  const id = input.formData.get("id");

  const parsed = productSchema.safeParse({
    name: input.formData.get("name"),
    categoryId: input.formData.get("categoryId"),
    description: input.formData.get("description"),
    price: input.formData.get("price"),
    stock: input.formData.get("stock"),
    weight: input.formData.get("weight"),
    isActive: input.formData.get("isActive"),
  });

  // Validasi data
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error),
    };
  }

  // Upload data ke cloudinary
  const files = input.files;
  const uploaded = await Promise.all(
    files.map((file) => uploadImage(file, "products")),
  );

  const data = parsed.data;

  if (id) {
    await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...data,
        slug: `${slugify(data.name)}-${id}`,
      },
    });
  } else {
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const product = await prisma.product.create({
      data: {
        ...data,
        slug: `${slugify(data.name)}-${uniqueSuffix}`,
        isActive: true,
      },
    });
    await prisma.productImage.createMany({
      data: uploaded.map((img, index) => ({
        imageUrl: img.url,
        publicId: img.public_id,
        productId: product.id,
        isPrimary: index === 0
      }))
    })
  }

  revalidatePath("/admin/products");

  redirect("/admin/products");
}
