import { NextResponse } from "next/server";

const BASE_URL = "https://rajaongkir.komerce.id/api/v1";
const KEY = process.env.SHIPPING_COST_KEY!;

const ALL_COURIERS = "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos";

export async function getCities() {
    const res = await fetch(`${BASE_URL}/city/10`, {
        headers: { key: KEY }
    })

    const data = await res.json();

    console.log(data);

    if(!data) {
        return NextResponse.json(
            { error: "data rusak"}, 
            { status: 404 }
        )
    }

    return NextResponse.json(data);
}

export async function checkOngkir({ origin, destination, weight }: {
    origin: string;
    destination: string;
    weight: number;
}) {
    const res = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
        method: "POST", 
        headers: {
            key: KEY,
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            origin, 
            destination,
            weight: String(weight),
            courier: ALL_COURIERS,
            price: "lowest"
        })
    })

    const data = await res.json();
    return data;
}