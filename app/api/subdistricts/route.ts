import { NextResponse } from "next/server";

const BASE_URL = "https://rajaongkir.komerce.id/api/v1";
const KEY = process.env.SHIPPING_COST_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  const res = await fetch(
    `${BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(query)}&limit=5&offset=0`,
    {
      method: "GET",
      headers: { key: KEY },
    },
  );

  const data = await res.json();
  return NextResponse.json(data.data ?? []);
}
