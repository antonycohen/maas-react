import { useState } from 'react';
import { Link } from 'react-router';
import { SubscriptionCTA } from './subscription-cta';
import { NoDigitalAccessCTA } from './no-digital-access-cta';
import { useRenderBlocks } from '@maas/web-cms-editor';
import { Article, CMSBlock, FEATURE_DIGITAL_ACCESS } from '@maas/core-api-models';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    useResizedImage,
} from '@maas/web-components';
import { useConnectedUser, useSubscriptionStatus, useQuota } from '@maas/core-store-session';
import { normalizeString } from '@maas/core-utils';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { useTranslation } from '@maas/core-translations';

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
    const { t } = useTranslation();
    const { isUserSubscribed } = useSubscriptionStatus();
    const { remaining: digitalAccessRemaining } = useQuota(FEATURE_DIGITAL_ACCESS);
    const connectedUser = useConnectedUser();
    const isAdmin = connectedUser?.roles?.includes('ADMIN') ?? false;
    const isProblem = type?.name ? normalizeString(type.name) === 'probleme' : false;
    const hasDigitalAccess = isUserSubscribed && digitalAccessRemaining > 0;
    const canViewContent = isAdmin || hasDigitalAccess;
    const isSubscribedWithoutAccess = isUserSubscribed && !hasDigitalAccess && !isAdmin;
    const blocks = useRenderBlocks(content);
    const solutionBlocks = useRenderBlocks(isProblem ? (customFields?.solution as CMSBlock[] | null) : null);
    const { resizedImage } = useResizedImage({ images: featuredImage?.resizedImages, width: 960 });
    const coverUrl = resizedImage?.url ?? featuredImage?.url;

    const [showSolution, setShowSolution] = useState(false);
    const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

    const showCta = !canViewContent && visibility !== 'public' && !isProblem;
    const handleShowSolution = () => {
        if (canViewContent) {
            setShowSolution(true);
        } else {
            setShowSubscribeDialog(true);
        }
    };

    return (
        <article className="flex w-full flex-col items-start gap-10 lg:max-w-150">
            {title && (
                <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight md:text-4xl">{title}</h1>
            )}
            {coverUrl && (
                <img
                    src={coverUrl}
                    alt={title ?? ''}
                    className="w-full rounded-lg object-cover"
                    loading="lazy"
                    decoding="async"
                />
            )}
            <div className="flex w-full flex-col items-start gap-5">{blocks}</div>
            {showCta && (isSubscribedWithoutAccess ? <NoDigitalAccessCTA /> : <SubscriptionCTA />)}
            {isProblem &&
                (!showSolution ? (
                    <button
                        onClick={handleShowSolution}
                        className="font-body rounded-tangente-xs flex h-[40px] w-full items-center justify-center bg-[#E31B22] px-4 py-2 text-[14px] leading-[20px] font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#c4161c]"
                    >
                        {t('home.viewSolution')}
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
                        <DialogTitle>
                            {isSubscribedWithoutAccess ? t('home.noDigitalAccessTitle') : t('home.solutionDialogTitle')}
                        </DialogTitle>
                        <DialogDescription>
                            {isSubscribedWithoutAccess
                                ? t('home.noDigitalAccessDescription')
                                : t('home.solutionDialogDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    {!isSubscribedWithoutAccess && (
                        <Link
                            to={PUBLIC_ROUTES.PRICING}
                            className="font-body flex h-[40px] w-full items-center justify-center rounded-[4px] bg-[#E31B22] px-4 py-2 text-[14px] leading-[20px] font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#c4161c]"
                        >
                            {t('home.subscribe')}
                        </Link>
                    )}
                </DialogContent>
            </Dialog>
        </article>
    );
};
