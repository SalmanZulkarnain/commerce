
import { z } from 'zod';

export const addressSchema = z.object({
    userId: z.string(),
    biteshipAreaId: z.string(),
    recepientName: z.string(),
    recepientPhone: z.string(),
    label: z.string(),
    address: z.string(),
    subdistrictName: z.string(),
    districtName: z.string(),
    cityName: z.string(),
    provinceName: z.string(),
    postalCode: z.string()
});

export type Address = z.infer<typeof addressSchema>;