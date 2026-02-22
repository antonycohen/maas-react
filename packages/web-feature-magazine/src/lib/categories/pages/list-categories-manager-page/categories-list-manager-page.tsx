import { Collection } from '@maas/web-collection';
import { useCategoriesListColumns } from './hooks/use-categories-list-columns';
import { useGetCategories } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button, ButtonGroup, Input } from '@maas/web-components';
import { Link, useSearchParams } from 'react-router';
import { IconLayoutList, IconPlus, IconBinaryTree } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';
import { useState, useEffect } from 'react';
import { CategoryTreeView } from './components/category-tree-view';

type ViewMode = 'list' | 'tree';

export function CategoriesListManagerPage() {
    const { t } = useTranslation();
    const columns = useCategoriesListColumns();
    const routes = useRoutes();

    const [searchParams, setSearchParams] = useSearchParams();
    const viewMode: ViewMode = searchParams.get('view') === 'tree' ? 'tree' : 'list';
    const setViewMode = (mode: ViewMode) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (mode === 'list') next.delete('view');
                else next.set('view', mode);
                return next;
            },
            { replace: true }
        );
    };

    const [treeSearchTerm, setTreeSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchTerm(treeSearchTerm), 300);
        return () => clearTimeout(timer);
    }, [treeSearchTerm]);

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('categories.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('categories.title')}
                    actions={
                        <div className="flex items-center gap-2">
                            <ButtonGroup>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <IconLayoutList className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'tree' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('tree')}
                                >
                                    <IconBinaryTree className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                            <Button asChild>
                                <Link to={routes.categoryNew()}>
                                    <IconPlus className="mr-2 h-4 w-4" />
                                    {t('categories.new')}
                                </Link>
                            </Button>
                        </div>
                    }
                />
                {viewMode === 'list' && (
                    <Collection
                        useLocationAsState
                        columns={columns}
                        filtersConfiguration={{
                            textFilter: {
                                placeholder: t('categories.search'),
                                queryParamName: 'name',
                            },
                        }}
                        useQueryFn={useGetCategories}
                        queryFields={{
                            id: null,
                            name: null,
                            description: null,
                            cover: null,
                            parent: {
                                fields: {
                                    id: null,
                                    name: null,
                                },
                            },
                            childrenCount: null,
                        }}
                    />
                )}
                {viewMode === 'tree' && (
                    <div className="space-y-4">
                        <Input
                            placeholder={t('categories.search')}
                            value={treeSearchTerm}
                            onChange={(e) => setTreeSearchTerm(e.target.value)}
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                        <CategoryTreeView searchTerm={debouncedSearchTerm} />
                    </div>
                )}
            </LayoutContent>
        </div>
    );
}
