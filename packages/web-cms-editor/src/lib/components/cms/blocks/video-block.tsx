import { CMSVideoBlock } from '@maas/core-api-models';
import { getVideoIframe } from '@maas/core-utils';

export const VideoBlock = ({ block, editMode }: { block: CMSVideoBlock; editMode?: boolean }) => {
    const { url, width, height } = block.data;

    if (!url && !editMode) return null;

    return url ? (
        getVideoIframe(url, width ?? undefined, height ?? undefined, 'aspect-video h-full w-full rounded-lg')
    ) : (
        <div className="h-full w-full rounded-lg bg-neutral-100" />
    );
};
