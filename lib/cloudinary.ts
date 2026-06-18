import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadResult = {
  url: string;
  public_id: string;
};

export async function uploadImage(file: File, folder: "products" | "payments"): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `hannan-store/${folder}`,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        },
      )
      .end(buffer);
  });
}

export async function deleteImage(publicIds: string[]) {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return {
      message: "Berhasil menghapus image di cloudinary",
      success: true,
      result
    };
  } catch (error) {
    return {
      message: "Gagal menghapus image",
      success: false,
      error
    };
  }
}