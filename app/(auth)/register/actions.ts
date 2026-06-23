"use server";

import z from "zod";
import { RegisterFormState, registerSchema } from "./schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerAction(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            errors: z.flattenError(parsed.error),
            enteredData: {
                name: String(rawData.name || ""),
                email: String(rawData.email || ""),
            }
        }
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    })

    if (existingUser) {
        return { errors: null, error: "Email sudah terdaftar" }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        }
    })

    return { errors: null, success: true, message: `Saving user to DB: ${parsed.data}` };
}
