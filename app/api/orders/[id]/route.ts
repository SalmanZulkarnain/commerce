import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }>}) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
            customer: true, 
            address: true,
            items: {
                include: {
                    product: {
                        include: {
                            images: {
                                where: { isPrimary: true},
                                take: 1
                            }
                        }
                    }
                }
            },
            payment: true
        }
    })

    if(!order) {
        return NextResponse.json({
            error: "Order tidak ditemukan"
        }, { status: 404 })
    }

    return NextResponse.json(order)
}