import { Category } from '@maas/core-api-models';
import { useGetCategories } from '@maas/core-api';
import { Skeleton } from '@maas/web-components';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';
import { useMemo } from 'react';
import { CategoryTreeNode, CategoryTreeNodeRow } from './category-tree-node';

type CategoryTreeViewProps = {
    searchTerm: string;
};

function buildTree(categories: Category[]): CategoryTreeNode[] {
    const nodeMap = new Map<string, CategoryTreeNode>();

    // First pass: create all nodes
    for (const cat of categories) {
        nodeMap.set(cat.id, { category: cat, children: [] });
    }

    const roots: CategoryTreeNode[] = [];

    // Second pass: attach children to parents
    for (const cat of categories) {
        const node = nodeMap.get(cat.id)!;
        if (cat.parent?.id && nodeMap.has(cat.parent.id)) {
            nodeMap.get(cat.parent.id)!.children.push(node);
        } else {
            // Root node or orphan (parent not in set)
            if (!cat.parent) {
                roots.push(node);
            } else {
                // Orphan: parent exists in data but not fetched — treat as root
                roots.push(node);
            }
        }
    }

    // Sort roots and children alphabetically
    const sortNodes = (nodes: CategoryTreeNode[]) => {
        nodes.sort((a, b) => a.category.name.localeCompare(b.category.name));
        for (const node of nodes) {
            sortNodes(node.children);
        }
    };
    sortNodes(roots);

    return roots;
}

function filterTree(nodes: CategoryTreeNode[], term: string): CategoryTreeNode[] {
    const normalizedTerm = term.toLowerCase();

    function nodeMatches(node: CategoryTreeNode): CategoryTreeNode | null {
        const nameMatches = node.category.name.toLowerCase().includes(normalizedTerm);
        const filteredChildren = node.children
            .map((child) => nodeMatches(child))
            .filter((child): child is CategoryTreeNode => child !== null);

        if (nameMatches || filteredChildren.length > 0) {
            return {
                category: node.category,
                children: nameMatches ? node.children : filteredChildren,
            };
        }
        return null;
    }

    return nodes.map((node) => nodeMatches(node)).filter((node): node is CategoryTreeNode => node !== null);
}

export function CategoryTreeView({ searchTerm }: CategoryTreeViewProps) {
    const { t } = useTranslation();
    const routes = useRoutes();

    const { data, isLoading } = useGetCategories({
        offset: 0,
        limit: 1000,
        fields: {
            id: null,
            name: null,
            description: null,
            cover: null,
            parent: { fields: { id: null, name: null } },
            childrenCount: null,
        },
    });

    const tree = useMemo(() => {
        if (!data?.data) return [];
        return buildTree(data.data);
    }, [data?.data]);

    const filteredTree = useMemo(() => {
        if (!searchTerm.trim()) return tree;
        return filterTree(tree, searchTerm.trim());
    }, [tree, searchTerm]);

    if (isLoading) {
        return (
            <div className="rounded-md border p-4">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="ml-10 h-10 w-[80%]" />
                    <Skeleton className="ml-10 h-10 w-[80%]" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="ml-10 h-10 w-[80%]" />
                </div>
            </div>
        );
    }

    if (filteredTree.length === 0) {
        return (
            <div className="rounded-md border p-8 text-center">
                <p className="text-muted-foreground text-sm">
                    {searchTerm ? t('common.noResults') : t('categories.empty')}
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border p-2">
            <div className="space-y-0.5">
                {filteredTree.map((node) => (
                    <CategoryTreeNodeRow
                        key={node.category.id}
                        node={node}
                        depth={0}
                        routes={routes}
                        defaultOpen={!!searchTerm}
                    />
                ))}
            </div>
        </div>
    );
}
