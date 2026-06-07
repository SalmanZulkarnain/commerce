import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: {
            slug
        },
        include: {
            category: true,
            images: true
        }
    })

    if (!product) {
        return NextResponse.json(
            { error: "Produk tidak ditemukan" },
            { status: 404 }
        )
    }

    return NextResponse.json(product);
}