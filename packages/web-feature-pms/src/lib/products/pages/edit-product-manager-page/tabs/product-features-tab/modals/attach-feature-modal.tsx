import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Button,
    Input,
} from '@maas/web-components';
import { useGetFeatures } from '@maas/core-api';
import { Feature } from '@maas/core-api-models';
import { IconSparkles, IconSearch } from '@tabler/icons-react';

interface AttachFeatureModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string;
    onSelectFeature: (feature: Feature) => void;
    existingFeatureIds: string[];
}

export const AttachFeatureModal = ({
    open,
    onOpenChange,
    productId,
    onSelectFeature,
    existingFeatureIds,
}: AttachFeatureModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: featuresResponse, isLoading } = useGetFeatures(
        {
            filters: { displayName: searchTerm || undefined },
            fields: {
                id: null,
                displayName: null,
                lookupKey: null,
                withQuota: null,
            },
            offset: 0,
            limit: 20,
        },
        {
            enabled: open,
        }
    );

    const availableFeatures =
        featuresResponse?.data?.filter((feature) => !existingFeatureIds.includes(feature.id)) ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Attach Feature to Product</DialogTitle>
                    <DialogDescription>Select a feature to attach to this product.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search features..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto rounded-md border">
                        {isLoading ? (
                            <div className="text-muted-foreground p-4 text-center">Loading features...</div>
                        ) : availableFeatures.length === 0 ? (
                            <div className="text-muted-foreground p-4 text-center">No available features found.</div>
                        ) : (
                            <ul className="divide-y">
                                {availableFeatures.map((feature) => (
                                    <li
                                        key={feature.id}
                                        className="hover:bg-muted/50 flex cursor-pointer items-center justify-between px-4 py-3 transition-colors"
                                        onClick={() => onSelectFeature(feature)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                                <IconSparkles className="text-muted-foreground h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{feature.displayName}</p>
                                                <p className="text-muted-foreground font-mono text-xs">
                                                    {feature.lookupKey}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Attach
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
