import { NextRequest, NextResponse } from "next/server";
const BASE_URL = "https://api.biteship.com"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    try {
        const response = await fetch(`${BASE_URL}/v1/locations/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.BITESHIP_API_KEY || ""
            }
        });

        if (!response.ok) return NextResponse.json({ success: false, message: "Gagal hit ke Biteship" }, { status: response.status })

        const result = await response.json();

        return NextResponse.json({
            success: true,
            result
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error"
        }, { status: 500 })
    }
}