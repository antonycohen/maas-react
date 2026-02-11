import * as z from 'zod';

export const countrySchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
});

export type Country = z.infer<typeof countrySchema>;
