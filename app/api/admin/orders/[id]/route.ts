import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!status) {
    return NextResponse.json(
      {
        message: "Tidak ditemukan status",
      },
      { status: 400 },
    );
  }

  const update = await prisma.order.update({
    where: { id: Number(id) },
    data: {
      status,
    },
  });

  return NextResponse.json(
    {
      message: `Berhasil mengubah status order menjadi ${update.status}`,
      update,
    },
    { status: 200 },
  );
}
