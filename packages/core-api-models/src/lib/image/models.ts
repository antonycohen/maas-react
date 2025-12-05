import * as z from "zod";

export const resizedImageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
  mode: z.string(),
});

export type ResizedImage = z.infer<typeof resizedImageSchema>;

export const ImageSchema = {
  id: z.string().nullable(),
  base64: z.string().nullable(),
  url: z.string().nullable(),
  downloadUrl: z.string().optional(),
  originalFilename: z.string().nullable(),
  resizedImages: z.array(resizedImageSchema).nullable(),
}


export type Image = z.infer<z.ZodObject<typeof ImageSchema>>;
