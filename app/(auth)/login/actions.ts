"use server";

import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const SIGNIN_ERROR_URL = "/error";
export async function handleCredentialsSignIn(callbackUrl: string, formData: FormData) {
    try {
        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        const session = await auth();

        if (result?.ok) {
            if (session?.user.role === "ADMIN") {
                redirect("/admin/orders")
            } else {
                redirect("/")
            }
        }

    } catch (error) {
        if (error instanceof AuthError) {
            return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
        }
        throw error;
    }
};

export async function handleOAuthSignIn(callbackUrl: string, providerId: string) {
    try {
        await signIn(providerId, {
            redirectTo: callbackUrl,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
        }
        throw error;
    }
}