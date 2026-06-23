import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { signInSchema } from "./zod"
import { ZodError } from "zod"

const providers: Provider[] = [
    Credentials({
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials) => {
            try {
                const parsed = signInSchema.safeParse(credentials);
                if (!parsed.success) {
                    console.log("❌ Zod Validation Failed:", parsed.error.format());
                    return null;
                };

                const { email, password } = parsed.data;

                const user = await prisma.user.findUnique({
                    where: { email: email.toLowerCase() }
                })

                console.log("🔍 DB User Found:", user ? "YES" : "NO");

                if (!user || !user.password) {
                    console.log("❌ User not found or has no password (OAuth user)");
                    throw new Error("Invalid credentials.")
                }

                const isValid = await bcrypt.compare(password, user.password)
                if (!isValid) return null;

                // return user object with their profile data
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            } catch (error) {
                if (error instanceof ZodError) {
                    // Return `null` to indicate that the credentials are invalid
                    console.error("💥 Authorize exploded:", error);
                    return null
                }

                console.error("💥 Catch block fallback:", error);
                return null;
            }
        },
    }),
    Google,
]

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials")

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
})