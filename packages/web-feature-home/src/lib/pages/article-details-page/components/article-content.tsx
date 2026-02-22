import { useState } from 'react';
import { Link } from 'react-router';
import { SubscriptionCTA } from './subscription-cta';
import { useRenderBlocks } from '@maas/web-cms-editor';
import { Article, CMSBlock } from '@maas/core-api-models';
import { useSubscriptionStatus } from '@maas/core-api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    useResizedImage,
} from '@maas/web-components';
import { useConnectedUser } from '@maas/core-store-session';
import { normalizeString } from '@maas/core-utils';
import { PUBLIC_ROUTES } from '@maas/core-routes';

export const ArticleContent = ({
    title,
    featuredImage,
    content,
    visibility,
    type,
    customFields,
}: {
    title?: Article['title'];
    featuredImage?: Article['featuredImage'];
    content?: Article['content'];
    visibility?: Article['visibility'];
    type?: Article['type'];
    customFields?: Article['customFields'];
}) => {
    const { isUserSubscribed } = useSubscriptionStatus();
    const connectedUser = useConnectedUser();
    const isAdmin = connectedUser?.roles?.includes('ADMIN') ?? false;
    const isProblem = type?.name ? normalizeString(type.name) === 'probleme' : false;
    const blocks = useRenderBlocks(content);
    const solutionBlocks = useRenderBlocks(isProblem ? (customFields?.solution as CMSBlock[] | null) : null);
    const { resizedImage } = useResizedImage({ images: featuredImage?.resizedImages, width: 960 });
    const coverUrl = resizedImage?.url ?? featuredImage?.url;

    const [showSolution, setShowSolution] = useState(false);
    const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

    const showOverlayAndCta = !isProblem && !isUserSubscribed && !isAdmin && visibility !== 'public';
    const handleShowSolution = () => {
        if (isAdmin || isUserSubscribed) {
            setShowSolution(true);
        } else {
            setShowSubscribeDialog(true);
        }
    };

    return (
        <article className="flex w-full flex-col items-start gap-10 lg:max-w-[600px]">
            {title && (
                <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight md:text-4xl">{title}</h1>
            )}
            {coverUrl && <img src={coverUrl} alt={title ?? ''} className="w-full rounded-lg object-cover" />}
            <div className="relative flex w-full flex-col items-start gap-5">
                {blocks}
                {showOverlayAndCta && (
                    <div className="pointer-events-none absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-t from-white to-transparent"></div>
                )}
            </div>
            {showOverlayAndCta && <SubscriptionCTA />}
            {isProblem &&
                (!showSolution ? (
                    <button
                        onClick={handleShowSolution}
                        className="font-body flex h-[40px] w-full items-center justify-center rounded-[4px] bg-[#E31B22] px-4 py-2 text-[14px] leading-[20px] font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#c4161c]"
                    >
                        Voir la solution
                    </button>
                ) : (
                    <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-6">
                        <h3 className="font-heading mb-4 text-xl font-semibold">Solution</h3>
                        <div className="flex flex-col gap-5">{solutionBlocks}</div>
                    </div>
                ))}
            <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Devenez membre</DialogTitle>
                        <DialogDescription>Devenez membre pour voir la solution, et tout tangente</DialogDescription>
                    </DialogHeader>
                    <Link
                        to={PUBLIC_ROUTES.PRICING}
                        className="font-body flex h-[40px] w-full items-center justify-center rounded-[4px] bg-[#E31B22] px-4 py-2 text-[14px] leading-[20px] font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#c4161c]"
                    >
                        S'abonner
                    </Link>
                </DialogContent>
            </Dialog>
        </article>
    );
};
