import { type JWT as DefaultJWT } from "next-auth/jwt";
import { type DefaultSession, type DefaultUser } from "next-auth"
import { Role } from "@/generated/prisma/enums";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: Role;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        role: Role;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        role: Role;
    }
}