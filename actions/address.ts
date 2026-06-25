"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/types/address";

export async function saveAddress(formData: FormData) {
    const session = await auth();

    if (!session?.user.id) {
        throw new Error("Unauthorized");
    }

    const parsed = addressSchema.safeParse({
        userId: session.user.id,
        biteshipAreaId: "none",
        recepientName: formData.get("recepientName"),
        recepientPhone: formData.get("recepientPhone"),
        label: formData.get("label"),
        address: formData.get("address"),
        cityName: formData.get("cityName"),
        provinceName: formData.get("provinceName"),
        districtName: formData.get("districtName"),
        subdistrictName: formData.get("subdistrictName"),
        postalCode: "none",
    })

    if (!parsed.success) {
        console.log(parsed.error.issues);
        return;
    }

    await prisma.address.create({
        data: parsed.data
    });
}

export async function searchBiteshipArea(query: string) {
    try {
        const response = await fetch(`https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`
            }
        })

        const data = await response.json();

        return data.areas || [];
    } catch (error) {
        console.error(error);
        return []
    }
}