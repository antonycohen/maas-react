import { CMSHtmlBlock } from '@maas/core-api-models';
import { cn, sanitizeHtml } from '@maas/core-utils';

const titlesClassName =
    '[&>h3>b]:font-bricolage [&>h3>b]:text-neutral-black [&>h3>b]:border-neutral-200 [&>h3>b]:pb-4 [&>h3>b]:text-lg [&>h3>b:not(:has(br))]:border-b [&>h3>b]:pb-4 [&>h3>b]:text-lg [&>h3>b]:w-full [&>h3>b]:inline-block [&>h3]:my-4';
const subtitlesClassName =
    '[&>div.widget-container>h3.widget-title]:text-neutral-black [&>div.widget-container>h3.widget-title]:font-montserrat [&>div.widget-container>h3.widget-title]:text-lg [&>div.widget-container>h3.widget-title]:font-bold';
const widgetContainerClassName =
    '[&>div.widget-container]:flex [&>div.widget-container]:flex-col [&>div.widget-container]:gap-y-6';
const widgetCardContainerClassName =
    '[&>div.widget-container>div.widget-card-container]:grid [&>div.widget-container>div.widget-card-container]:grid-cols-4 [&>div.widget-container>div.widget-card-container]:lg:grid-cols-6 [&>div.widget-container>div.widget-card-container]:gap-6';
const widgetCardClassName =
    '[&>div.widget-container>div.widget-card-container>div.widget-card>p.widget-card-title]:font-bricolage [&>div.widget-container>div.widget-card-container>div.widget-card>p.widget-text-content>b]:font-bricolage [&>div.widget-container>div.widget-card-container>div.widget-card]:border [&>div.widget-container>div.widget-card-container>div.widget-card]:border-neutral-200 [&>div.widget-container>div.widget-card-container>div.widget-card]:rounded-md [&>div.widget-container>div.widget-card-container>div.widget-card]:p-4 [&>div.widget-container>div.widget-card-container>div.widget-card]:col-span-3 [&>div.widget-container>div.widget-card-container>div.widget-card]:flex [&>div.widget-container>div.widget-card-container>div.widget-card]:flex-col [&>div.widget-container>div.widget-card-container>div.widget-card]:items-center [&>div.widget-container>div.widget-card-container>div.widget-card]:gap-y-3 [&>div.widget-container>div.widget-card-container>div.widget-card]:text-center';

type HtmlBlockProps = {
    block: CMSHtmlBlock;
    editMode?: boolean;
};

export const HtmlBlock = (props: HtmlBlockProps) => {
    const { block } = props;

    if (!block.data) return null;

    return (
        <div className="rte-content text-sm text-neutral-900">
            <div
                className={cn(
                    'flex flex-col gap-y-6',
                    titlesClassName,
                    subtitlesClassName,
                    widgetContainerClassName,
                    widgetCardContainerClassName,
                    widgetCardClassName
                )}
            >
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.html) }} />
            </div>
        </div>
    );
};
