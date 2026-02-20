import * as z from 'zod';
import { readImageSchema } from '../image';
import { categorySchema } from '../category';
import { readUserRefSchema } from '../users';

export const homepageIssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    cover: z.object(readImageSchema).nullable(),
    publishedAt: z.string().nullable(),
});

export type HomepageIssue = z.infer<typeof homepageIssueSchema>;

export const homepageArticleSchema = z.object({
    id: z.string(),
    title: z.string(),
    cover: z.object(readImageSchema).nullable(),
    categories: z.array(categorySchema).nullable(),
    publishedAt: z.string().nullable(),
    author: readUserRefSchema.nullable(),
});

export type HomepageArticle = z.infer<typeof homepageArticleSchema>;

export const homepageFolderSchema = z.object({
    id: z.string(),
    organization: z
        .object({
            id: z.string(),
            name: z.string().nullable(),
            type: z.string().nullable(),
            logo: z.object(readImageSchema).nullable(),
        })
        .nullable(),
    type: z.string().nullable(),
    isDefault: z.boolean().nullable(),
    name: z.string(),
    description: z.string().nullable(),
    cover: z.object(readImageSchema).nullable(),
    isPublished: z.boolean().nullable(),
});

export type HomepageFolder = z.infer<typeof homepageFolderSchema>;

export const homepageNewsArticleSchema = z.object({
    type: z.literal('article'),
    article: homepageArticleSchema,
});

export const homepageNewsIssueSchema = z.object({
    type: z.literal('issue'),
    issue: homepageIssueSchema,
});

export const homepageNewsFolderSchema = z.object({
    type: z.literal('folder'),
    folder: homepageFolderSchema,
});

export const homepageNewsItemSchema = z.discriminatedUnion('type', [
    homepageNewsArticleSchema,
    homepageNewsIssueSchema,
    homepageNewsFolderSchema,
]);

export type HomepageNewsItem = z.infer<typeof homepageNewsItemSchema>;

export const homepageResponseSchema = z.object({
    latestIssue: homepageIssueSchema.nullable(),
    featuredArticles: z.array(homepageArticleSchema),
    news: z.array(homepageNewsItemSchema),
    jeuxDefis: z.array(homepageArticleSchema),
});

export type HomepageResponse = z.infer<typeof homepageResponseSchema>;
