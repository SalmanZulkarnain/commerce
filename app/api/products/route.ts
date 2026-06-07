import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            ...(categorySlug && {
                category: { slug: categorySlug }
            })
        }, 
        include: {
            category: true, 
            images: {
                where: { isPrimary: true },
                take: 1
            }
        }, 
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(products);
}