import { ReactNode } from 'react';

type LayoutHeaderProps = {
    pageTitle: string;
    pageDescription?: string;
    actions?: ReactNode;
};

export function LayoutHeader(props: LayoutHeaderProps) {
    const { pageTitle, pageDescription, actions } = props;

    return (
        <div className="flex flex-col">
            {/* Main content */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-col">
                    <h1 className="text-foreground justify-start text-3xl leading-9 font-semibold">{pageTitle}</h1>
                    {pageDescription && (
                        <p className="text-ring justify-start text-3xl leading-9 font-semibold">{pageDescription}</p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {/* Actions */}
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            </div>
        </div>
    );
}
