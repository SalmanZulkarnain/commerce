import { deleteImage } from "@/lib/cloudinary";

export async function deleteProductImages(publicIds: string[]) {
    if (publicIds.length === 0) return;

    await deleteImage(publicIds);
}