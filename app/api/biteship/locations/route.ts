import { NextRequest, NextResponse } from "next/server";
const BASE_URL = "https://api.biteship.com"

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BASE_URL}/v1/locations`, {
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

export async function POST(request: Request) {
    const { name, contact_name, contact_phone, address, note, postal_code, latitude, longitude, type } = await request.json();

    try {
        const response = await fetch(`${BASE_URL}/v1/locations`, {
            method: "POST",
            headers: {
                Authorization: process.env.BITESHIP_API_KEY || "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                contact_name,
                contact_phone,
                address,
                note,
                postal_code,
                latitude,
                longitude,
                type
            })
        })

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Error asli dari Biteship:", errorData);
            return NextResponse.json({ success: false, message: `Gagal hit ke Biteship` }, { status: response.status })
        }

        const result = await response.json()

        return NextResponse.json({
            success: true,
            result
        }, { status: 201 })
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            message: err.message || "Internal server error"
        }, { status: 500 })
    }
}
