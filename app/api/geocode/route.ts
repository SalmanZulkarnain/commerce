import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query diperlukan" }, { status: 400 });
  }

  try {
    // Tembak ke Nominatim OSM
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      {
        method: "GET",
        headers: {
          // 💡 KUNCINYA DI SINI: Wajib kasih nama aplikasi bebas + email fiktif/asli lu
          "User-Agent": "AplikasiTokoSaya/1.0 (kontak-saya@gmail.com)",
        },
      }
    );

    if (!response.ok) throw new Error("Gagal mengambil data dari OSM");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}