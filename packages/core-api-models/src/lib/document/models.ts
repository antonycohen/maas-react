import * as z from 'zod';

export const readDocumentSchema = {
  id: z.string().nullable(),
  base64: z.string().nullable(),
  url: z.string().nullable(),
  downloadUrl: z.string().optional(),
  originalFilename: z.string().nullable(),
};

export const updateDocumentSchema = z
  .object({
    id: z.string().nullish(),
    base64: z.string().nullish(),
    url: z.string().nullish(),
    downloadUrl: z.string().nullish(),
    originalFilename: z.string().nullish(),
  })
  .refine((data) => data.base64 || data.downloadUrl || data.id, {
    message: 'Either base64, downloadUrl, or id must be provided',
  });

export type Document = z.infer<z.ZodObject<typeof readDocumentSchema>>;
