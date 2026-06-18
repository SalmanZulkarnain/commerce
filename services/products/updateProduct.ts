import { ProductInput } from "@/app/(admin)/admin/products/schema";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { syncProductImages } from "./syncProductImages";
import { ProductImageState } from "@/app/(admin)/admin/products/types";

type UpdateProductParams = {
    productId: number;
    data: ProductInput;
    currentImages: ProductImageState[];
}

export async function updateProduct({
    productId,
    data,
    currentImages
}: UpdateProductParams) {
        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                ...data,
                slug: `${slugify(data.name)}-${productId}`,
            },
        });

        await syncProductImages({
            productId,
            currentImages
        });

        return product;
}