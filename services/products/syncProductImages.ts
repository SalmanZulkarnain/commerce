import { ProductImageState } from "@/app/(admin)/admin/products/types";
import { deleteImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { uploadProductImages } from "./uploadProductImages";

type SyncProductImagesParams = {
    productId: number;
    currentImages: ProductImageState[];
}

export async function syncProductImages({
    productId,
    currentImages
}: SyncProductImagesParams) {
    const dbImages = await prisma.productImage.findMany({
        where: {
            productId
        }
    });

    const existingImages = currentImages.filter(img => img.type === "existing");

    const currentIds = existingImages.map(img => img.id);
    const removedImages = dbImages.filter(img => !currentIds.includes(img.id));

    await deleteImage(
        removedImages.map(
            img => img.publicId
        )
    )

    await prisma.productImage.deleteMany({
        where: {
            id: {
                in: removedImages.map(
                    img => img.id
                )
            }
        }
    });

    const newImages = currentImages.filter(img => img.type === "new");

    const uploadedImages = await uploadProductImages(
        newImages.map(img => img.file)
    )

    await prisma.productImage.createMany({
        data: uploadedImages.map(
            img => ({
                imageUrl: img.url,
                publicId: img.public_id,
                productId,
                isPrimary: false
            })
        )
    })

    const allImages = await prisma.productImage.findMany({
        where: { productId },
        orderBy: {
            id: "asc"
        }
    });

    await prisma.productImage.updateMany({
        where: { productId },
        data: {
            isPrimary: false
        }
    });

    if (allImages.length > 0) {
        await prisma.productImage.update({
            where: {
                id: allImages[0].id
            },
            data: {
                isPrimary: true
            }
        });
    }
}