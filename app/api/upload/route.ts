import { uploadImage } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const formData = await request.formData(); 
    const file  = formData.get("file") as File;

    if(!file) {
        return NextResponse.json({ error: "File tidak ada"}, {status: 400});
    }

    const url = await uploadImage(file, "payments");
    return NextResponse.json(url)
}