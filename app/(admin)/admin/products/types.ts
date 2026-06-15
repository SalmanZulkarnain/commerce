import { z} from "zod";
import { ProductInput } from "./schema";

export type ProductFormState = {
    errors: z.ZodFlattenedError<ProductInput> | null;
}

export type ImagePreview = {
  id: string;
  file: File;
  previewUrl: string;
};