import { ProductInput } from "@/app/(admin)/admin/products/schema";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { uploadProductImages } from "./uploadProductImages";
import { ProductImageState } from "@/app/(admin)/admin/products/types";

type CreateProductParams = {
    data: ProductInput;
    currentImages: ProductImageState[];
}

export async function createProduct({
    data,
    currentImages
}: CreateProductParams) {
    const files = currentImages.filter(img => img.type === "new").map(img => img.file);

    const uploadedImages = await uploadProductImages(files)
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);

    return prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
            data: {
                ...data,
                slug: `${slugify(data.name)}-${uniqueSuffix}`,
                isActive: true,
            },
        });

        await tx.productImage.createMany({
            data: uploadedImages.map((img, index) => ({
                productId: product.id,
                imageUrl: img.url,
                publicId: img.public_id,
                isPrimary: index === 0
            })),
        });

        return product;
    })
}