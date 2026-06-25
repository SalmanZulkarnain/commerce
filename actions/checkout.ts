"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function checkAddress() {
    const session = await auth();
    
    if (!session) return;
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { addresses: true }
    })

    if (!user || user.addresses.length === 0) {
        redirect("/settings")
    }
}