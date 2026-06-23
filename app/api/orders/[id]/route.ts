import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Props) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            customer: true,
            address: true,
            items: {
                include: {
                    product: {
                        include: {
                            images: {
                                where: { isPrimary: true },
                                take: 1
                            }
                        }
                    }
                }
            },
            payment: true
        }
    })

    if (!order) {
        return NextResponse.json({
            error: "Order tidak ditemukan"
        }, { status: 404 })
    }

    return NextResponse.json(order)
}