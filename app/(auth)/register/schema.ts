import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type RegisterFormState = {
    errors: z.ZodFlattenedError<RegisterInput> | null;
    success?: boolean;
    error?: string;
    message?: string;
    enteredData?: {
        name?: string;
        email?: string;
    }
};