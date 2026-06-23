import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginFormState = {
    errors: z.ZodFlattenedError<LoginInput> | null;
    error?: string;
    success?: boolean;
    message?: string;
    enteredData?: {
        email?: string;
    }
};