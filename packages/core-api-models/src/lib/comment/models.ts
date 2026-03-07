import * as z from 'zod';
import { readUserRefSchema } from '../users';

export const commentRefTypeEnum = z.enum(['project', 'club', 'customer']);
export type CommentRefType = z.infer<typeof commentRefTypeEnum>;

export const readCommentSchema = z.object({
    id: z.string(),
    value: z.string().nullable(),
    refType: commentRefTypeEnum.nullable().optional(),
    refId: z.string().nullable().optional(),
    author: z.object(readUserRefSchema.shape).nullable().optional(),
    isDeleted: z.boolean().nullable().optional(),
    isReferentAuthor: z.boolean().nullable().optional(),
    createdAt: z.iso.datetime().nullable().optional(),
    updatedAt: z.iso.datetime().nullable().optional(),
});
export type ReadComment = z.infer<typeof readCommentSchema>;

export const createCommentSchema = z.object({
    value: z.string().min(1),
    refType: commentRefTypeEnum,
    refId: z.string().min(1),
});
export type CreateComment = z.infer<typeof createCommentSchema>;
