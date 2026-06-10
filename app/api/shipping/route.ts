import { NextResponse } from "next/server";
import { checkOngkir } from "@/lib/rajaongkir";

const ORIGIN_CITY_ID = "12780";

export async function POST(request: Request) {
    const body = await request.json();

    const { destination, weight } = body;

    if (!destination || !weight) {
        return NextResponse.json(
            { error: "destination dan weight wajib diisi" },
            { status: 400 }
        )
    }

    const results = await checkOngkir({
        origin: ORIGIN_CITY_ID,
        destination,
        weight,
    })

    return NextResponse.json(results);
}

