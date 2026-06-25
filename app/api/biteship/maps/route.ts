import { NextRequest, NextResponse } from "next/server";
const BASE_URL = "https://api.biteship.com"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const input = searchParams.get('input');

    if (!input || input.trim() === "") {
        return NextResponse.json({
            success: true,
            data: {
                input,
                areas: []
            }
        })
    };

    try {
        const response = await fetch(`${BASE_URL}/v1/maps/areas?countries=ID&input=${encodeURIComponent(input)}&type=single`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.BITESHIP_API_KEY || ""
            }
        });

        if (!response.ok) return NextResponse.json({ success: false, message: "Gagal hit ke Biteship" }, { status: response.status })

        const result = await response.json();

        const rawAreas = result.areas || [];

        const searchInputLower = input.toLowerCase().trim();

        const filteredAreas = rawAreas.filter((area: any) => {
            const areaNameLower = area.name.toLowerCase();

            return areaNameLower.includes(searchInputLower);
        })

        return NextResponse.json({
            success: true,
            data: {
                input,
                areas: filteredAreas
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal server error"
        }, { status: 500 })
    }

}