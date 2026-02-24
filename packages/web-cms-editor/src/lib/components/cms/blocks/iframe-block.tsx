import { CMSIFrameBlock } from '@maas/core-api-models';

type IFrameBlockProps = {
    block: CMSIFrameBlock;
    editMode?: boolean;
};

export function IFrameBlock(props: IFrameBlockProps) {
    const { block, editMode = false } = props;
    const { url, height, width } = block.data;

    if (!url && !editMode) return null;

    const getValidHeight = () => {
        const h = height ? Number(height) : 0;
        if (!h || h < 50 || h > 1400) return 300;
        return h;
    };

    return (
        <div
            className="h-full w-full rounded-lg bg-neutral-100"
            style={{
                height: `${getValidHeight()}px`,
                width: width ? `${width}px` : '100%',
            }}
        >
            {url && <iframe src={url} title="project-iframe-block" className="h-full w-full" allowFullScreen />}
        </div>
    );
}
