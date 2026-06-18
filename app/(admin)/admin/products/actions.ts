"use server";

import { prisma } from "@/lib/prisma";
import { productSchema } from "./schema";
import { z } from "zod";
import { deleteImage } from "@/lib/cloudinary";
import { ProductFormState, ProductImageState } from "./types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProduct } from "@/services/products/createProduct";
import { updateProduct } from "@/services/products/updateProduct";

export default async function saveProductAction(
  prevState: ProductFormState,
  input: {
    formData: FormData;
    currentImages: ProductImageState[];
  },
): Promise<ProductFormState> {
  console.dir(input.currentImages, {
    depth: null
});
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

  const data = parsed.data;

  if (id) {
    await updateProduct({
      productId: Number(id),
      data,
      currentImages: input.currentImages
    })
  } else {
    await createProduct({
      data,
      currentImages: input.currentImages
    });
  }

  revalidatePath("/admin/products");

  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get("id");
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: true }
  });

  const publicIds = product?.images.map(img => img.publicId) ?? [];
  if (publicIds.length > 0) {
    await deleteImage(publicIds);
    await prisma.productImage.deleteMany({
      where: { productId: Number(id) }
    })
  }
  await prisma.product.delete({ where: { id: Number(id) } })

  revalidatePath("/admin/products");

  redirect("/admin/products");
}