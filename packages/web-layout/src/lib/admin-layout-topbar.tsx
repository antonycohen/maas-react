import { DocumentationSearchInput, SidebarTrigger } from '@maas/web-components';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@maas/core-utils';
import { useTranslation } from '@maas/core-translations';

type LayoutTopbarProps = {
    buttons?: ReactNode[];
    className?: string;
};

export function AdminLayoutTopbar(props: LayoutTopbarProps) {
    const { buttons, className } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                'bg-background relative flex h-12 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:h-16',
                className
            )}
        >
            {/* Left side - Sidebar trigger */}
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
            </div>

            {/* Center - Search input */}
            <div className="absolute top-1/2 left-1/2 w-[373px] -translate-x-1/2 -translate-y-1/2">
                <DocumentationSearchInput
                    source={[
                        {
                            value: '1',
                            label: t('home.gettingStarted'),
                            url: '/docs/getting-started',
                            category: t('home.guides'),
                        },
                        {
                            value: '2',
                            label: t('home.apiReference'),
                            url: '/docs/api',
                            description: t('home.fullApiDocumentation'),
                        },
                    ]}
                    placeholder={t('common.search')}
                    shortcut="⌘K"
                    className="w-full"
                    onNavigate={(url) => navigate(url)}
                />
            </div>

            <div className="flex items-center gap-4">
                {buttons && buttons.length > 0 && buttons.map((button, index) => <div key={index}>{button}</div>)}
            </div>
        </div>
    );
}
