import { uploadImage } from "@/lib/cloudinary";

export async function uploadProductImages(files: File[]) {
    return await Promise.all(
        files.map(file =>
            uploadImage(file, "products")
        )
    );
}