import { useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Skeleton,
    Textarea,
} from '@maas/web-components';
import { useGetResourceComments, useCreateComment, useDeleteComment } from '@maas/core-api';
import { ReadComment } from '@maas/core-api-models';
import { useConnectedUser } from '@maas/core-store-session';
import { useTranslation } from '@maas/core-translations';
import { IconSend, IconTrash } from '@tabler/icons-react';

interface CustomerCommentsSectionProps {
    customerId: string;
}

const CommentItem = ({
    comment,
    connectedUserId,
    onDelete,
    isDeleting,
}: {
    comment: ReadComment;
    connectedUserId: string | null;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}) => {
    const { t } = useTranslation();
    const author = comment.author;
    const initials = [author?.firstName?.[0], author?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
    const isOwn = connectedUserId === author?.id;
    const displayName =
        [author?.firstName, author?.lastName].filter(Boolean).join(' ') || author?.email || t('comments.unknownAuthor');

    return (
        <div className="group flex items-start gap-2 py-2">
            <Avatar className="mt-2 h-6 w-6 shrink-0">
                <AvatarImage src={author?.profileImage?.url ?? undefined} />
                <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-medium">{displayName}</span>
                    <span className="text-muted-foreground text-[11px]">
                        {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleDateString(undefined, {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : ''}
                    </span>
                    {isOwn && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive ml-auto h-5 w-5 opacity-0 group-hover:opacity-100"
                            onClick={() => onDelete(comment.id)}
                            disabled={isDeleting}
                        >
                            <IconTrash className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{comment.value}</p>
            </div>
        </div>
    );
};

export const CustomerCommentsSection = ({ customerId }: CustomerCommentsSectionProps) => {
    const { t } = useTranslation();
    const connectedUser = useConnectedUser();
    const [newComment, setNewComment] = useState('');

    const { data, isLoading } = useGetResourceComments(
        {
            resource: 'customers',
            refId: customerId,
            fields: {
                id: null,
                value: null,
                author: { fields: { id: null, firstName: null, lastName: null, email: null, profileImage: null } },
                createdAt: null,
                isReferentAuthor: null,
            },
            limit: 50,
            sortDirection: 'desc',
        },
        { enabled: !!customerId }
    );

    const { mutate: createComment, isPending: isCreating } = useCreateComment();
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

    const handleSubmit = () => {
        const value = newComment.trim();
        if (!value) return;

        createComment({ value, refType: 'customer', refId: customerId }, { onSuccess: () => setNewComment('') });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleDelete = (commentId: string) => {
        deleteComment(commentId);
    };

    const comments = data?.data ?? [];

    return (
        <Card className="gap-0 rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('comments.title')}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-0 pb-4">
                {/* New comment input */}
                <div className="flex gap-2">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('comments.placeholder')}
                        rows={1}
                        className="min-h-8 resize-none text-sm"
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={handleSubmit}
                        disabled={!newComment.trim() || isCreating}
                    >
                        <IconSend className="h-4 w-4" />
                    </Button>
                </div>

                {/* Comments list */}
                {isLoading ? (
                    <div className="mt-3 space-y-2">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length > 0 ? (
                    <div className="mt-1 divide-y">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                connectedUserId={connectedUser?.id ?? null}
                                onDelete={handleDelete}
                                isDeleting={isDeleting}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground mt-3 text-center text-xs">{t('comments.empty')}</p>
                )}
            </CardContent>
        </Card>
    );
};
