import * as z from 'zod';
import { readImageSchema } from '../image';
import { categorySchema } from '../category';

export const homepageIssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    cover: z.object(readImageSchema).nullable(),
});

export type HomepageIssue = z.infer<typeof homepageIssueSchema>;

export const homepageArticleSchema = z.object({
    id: z.string(),
    title: z.string(),
    cover: z.object(readImageSchema).nullable(),
    categories: z.array(categorySchema).nullable(),
});

export type HomepageArticle = z.infer<typeof homepageArticleSchema>;

export const homepageCategoryEntrySchema = z.object({
    category: categorySchema,
    articles: z.array(homepageArticleSchema),
});

export type HomepageCategoryEntry = z.infer<typeof homepageCategoryEntrySchema>;

export const homepageResponseSchema = z.object({
    latestIssue: homepageIssueSchema.nullable(),
    featuredArticles: z.array(homepageArticleSchema),
    categories: z.array(homepageCategoryEntrySchema),
});

export type HomepageResponse = z.infer<typeof homepageResponseSchema>;
