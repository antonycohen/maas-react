import { Category } from '@maas/core-api-models';
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger, LongText, Badge } from '@maas/web-components';
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export type CategoryTreeNode = {
    category: Category;
    children: CategoryTreeNode[];
};

type CategoryTreeNodeRowProps = {
    node: CategoryTreeNode;
    depth: number;
    workspaceBaseUrl: string;
    defaultOpen?: boolean;
};

export function CategoryTreeNodeRow({ node, depth, workspaceBaseUrl, defaultOpen = true }: CategoryTreeNodeRowProps) {
    const { category, children } = node;
    const hasChildren = children.length > 0;
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const cover = category.cover;
    const imageUrl = cover?.url || cover?.base64;

    const content = (
        <div className="group/row hover:bg-muted/50 flex items-center gap-2 rounded-md px-3 py-2">
            {hasChildren ? (
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <IconChevronDown className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                    </Button>
                </CollapsibleTrigger>
            ) : (
                <div className="h-7 w-7" />
            )}

            {imageUrl ? (
                <img src={imageUrl} alt={category.name} className="h-8 w-8 shrink-0 rounded object-cover" />
            ) : (
                <div className="bg-muted h-8 w-8 shrink-0 rounded" />
            )}

            <Link
                to={`${workspaceBaseUrl}/categories/${category.id}`}
                className="min-w-0 font-medium underline-offset-4 hover:underline"
            >
                <LongText className="max-w-64">{category.name}</LongText>
            </Link>

            {hasChildren && (
                <Badge variant="secondary" className="text-xs">
                    {children.length}
                </Badge>
            )}

            {category.description && (
                <LongText className="text-muted-foreground max-w-48 text-sm">{category.description}</LongText>
            )}
        </div>
    );

    if (!hasChildren) {
        return content;
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            {content}
            <CollapsibleContent>
                <div className="ml-6 space-y-0.5 border-l-2 pl-4">
                    {children.map((child) => (
                        <CategoryTreeNodeRow
                            key={child.category.id}
                            node={child}
                            depth={depth + 1}
                            workspaceBaseUrl={workspaceBaseUrl}
                            defaultOpen={defaultOpen}
                        />
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
