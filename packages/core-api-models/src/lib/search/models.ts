import * as z from 'zod';

export const searchHighlightSchema = z.record(z.string(), z.array(z.string()));

export const searchResultSchema = z.object({
    id: z.string(),
    entityType: z.enum(['article', 'issue', 'folder']),
    organizationId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    coverUrl: z.string().nullable().optional(),
    isPublished: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    // Article-specific
    categoryNames: z.array(z.string()).optional(),
    authorName: z.string().optional(),
    visibility: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    publishedAt: z.string().nullable().optional(),
    // Issue-specific
    issueNumber: z.string().optional(),
    brandName: z.string().optional(),
    pageCount: z.number().optional(),
    // Folder-specific
    articleCount: z.number().optional(),
    // Search metadata
    score: z.number().optional(),
    highlight: searchHighlightSchema.optional(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

export const searchResponseSchema = z.object({
    total: z.number(),
    results: z.array(searchResultSchema),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;
