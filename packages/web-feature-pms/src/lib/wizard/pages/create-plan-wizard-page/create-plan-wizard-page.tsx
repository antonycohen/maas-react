import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Textarea,
    Badge,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent } from '@maas/web-layout';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useCreatePlan, useCreateProduct, useCreatePrice } from '@maas/core-api';
import { PriceInterval } from '@maas/core-api-models';
import {
    IconArrowLeft,
    IconArrowRight,
    IconCheck,
    IconLoader2,
    IconLayoutGrid,
    IconPackage,
    IconCoin,
} from '@tabler/icons-react';
import { toast } from 'sonner';

type WizardStep = 'plan' | 'products' | 'prices' | 'review';

type ProductDraft = {
    name: string;
    description: string;
    lookupKey: string;
    prices: PriceDraft[];
};

type PriceDraft = {
    unitAmount: number;
    currency: string;
    recurringInterval: PriceInterval;
    recurringIntervalCount: number;
    lookupKey: string;
};

const STEPS: { key: WizardStep; title: string; icon: React.ReactNode }[] = [
    { key: 'plan', title: 'Plan Details', icon: <IconLayoutGrid className="h-5 w-5" /> },
    { key: 'products', title: 'Products', icon: <IconPackage className="h-5 w-5" /> },
    { key: 'prices', title: 'Prices', icon: <IconCoin className="h-5 w-5" /> },
    { key: 'review', title: 'Review', icon: <IconCheck className="h-5 w-5" /> },
];

export function CreatePlanWizardPage() {
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState<WizardStep>('plan');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Plan data
    const [planName, setPlanName] = useState('');
    const [planDescription, setPlanDescription] = useState('');

    // Products data
    const [products, setProducts] = useState<ProductDraft[]>([
        { name: '', description: '', lookupKey: '', prices: [] },
    ]);

    // Current product index for prices step
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    const createPlanMutation = useCreatePlan();
    const createProductMutation = useCreateProduct();
    const createPriceMutation = useCreatePrice();

    const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

    const goNext = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < STEPS.length) {
            setCurrentStep(STEPS[nextIndex].key);
        }
    };

    const goBack = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(STEPS[prevIndex].key);
        }
    };

    const addProduct = () => {
        setProducts([...products, { name: '', description: '', lookupKey: '', prices: [] }]);
    };

    const updateProduct = (index: number, updates: Partial<ProductDraft>) => {
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], ...updates };
        setProducts(newProducts);
    };

    const removeProduct = (index: number) => {
        if (products.length > 1) {
            setProducts(products.filter((_, i) => i !== index));
        }
    };

    const addPrice = (productIndex: number) => {
        const newProducts = [...products];
        newProducts[productIndex].prices.push({
            unitAmount: 0,
            currency: 'usd',
            recurringInterval: 'month',
            recurringIntervalCount: 1,
            lookupKey: '',
        });
        setProducts(newProducts);
    };

    const updatePrice = (productIndex: number, priceIndex: number, updates: Partial<PriceDraft>) => {
        const newProducts = [...products];
        newProducts[productIndex].prices[priceIndex] = {
            ...newProducts[productIndex].prices[priceIndex],
            ...updates,
        };
        setProducts(newProducts);
    };

    const removePrice = (productIndex: number, priceIndex: number) => {
        const newProducts = [...products];
        newProducts[productIndex].prices = newProducts[productIndex].prices.filter((_, i) => i !== priceIndex);
        setProducts(newProducts);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // 1. Create the plan
            const plan = await createPlanMutation.mutateAsync({
                name: planName,
                description: planDescription,
                active: true,
            });

            // 2. Create products and their prices
            for (const productDraft of products) {
                if (!productDraft.name) continue;

                const product = await createProductMutation.mutateAsync({
                    name: productDraft.name,
                    description: productDraft.description,
                    active: true,
                    plan: { id: plan.id },
                });

                // Create prices for this product
                for (const priceDraft of productDraft.prices) {
                    await createPriceMutation.mutateAsync({
                        unitAmountInCents: priceDraft.unitAmount,
                        currency: priceDraft.currency,
                        recurringInterval: priceDraft.recurringInterval,
                        recurringIntervalCount: priceDraft.recurringIntervalCount,
                        lookupKey: priceDraft.lookupKey || '',
                        active: true,
                        recurringUsageType: 'licensed',
                        product: { id: product.id },
                    });
                }
            }

            toast.success('Plan created successfully!');
            navigate(`${workspaceUrl}/pms/plans/${plan.id}/info`);
        } catch (error) {
            toast.error('Failed to create plan. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 'plan':
                return planName.trim().length > 0;
            case 'products':
                return products.some((p) => p.name.trim().length > 0);
            case 'prices':
                return true;
            case 'review':
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen">
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: `${workspaceUrl}/` },
                        { label: 'Subscription Plans', to: `${workspaceUrl}/pms/plans` },
                        { label: 'Create Plan Wizard' },
                    ]}
                />
            </header>

            <LayoutContent>
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step.key} className="flex items-center">
                                <div
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                                        index === currentStepIndex
                                            ? 'bg-primary text-primary-foreground'
                                            : index < currentStepIndex
                                              ? 'bg-primary/20 text-primary'
                                              : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {step.icon}
                                    <span className="font-medium">{step.title}</span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`mx-2 h-1 w-16 ${
                                            index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <Card className="rounded-2xl">
                    {currentStep === 'plan' && (
                        <>
                            <CardHeader>
                                <CardTitle>Plan Details</CardTitle>
                                <CardDescription>
                                    Enter the basic information for your subscription plan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="planName">Plan Name *</Label>
                                    <Input
                                        id="planName"
                                        placeholder="e.g., Pro Plan"
                                        value={planName}
                                        onChange={(e) => setPlanName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="planDescription">Description</Label>
                                    <Textarea
                                        id="planDescription"
                                        placeholder="Describe what this plan offers..."
                                        value={planDescription}
                                        onChange={(e) => setPlanDescription(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </>
                    )}

                    {currentStep === 'products' && (
                        <>
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                                <CardDescription>
                                    Add products to your plan. Each product can have its own pricing.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {products.map((product, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="mb-4 flex items-start justify-between">
                                            <Badge variant="outline">Product {index + 1}</Badge>
                                            {products.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={() => removeProduct(index)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Product Name *</Label>
                                                <Input
                                                    placeholder="e.g., API Access"
                                                    value={product.name}
                                                    onChange={(e) => updateProduct(index, { name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Input
                                                    placeholder="What does this product include?"
                                                    value={product.description}
                                                    onChange={(e) =>
                                                        updateProduct(index, { description: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Lookup Key</Label>
                                                <Input
                                                    placeholder="api_access"
                                                    className="font-mono"
                                                    value={product.lookupKey}
                                                    onChange={(e) =>
                                                        updateProduct(index, { lookupKey: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                <Button variant="outline" onClick={addProduct}>
                                    + Add Another Product
                                </Button>
                            </CardContent>
                        </>
                    )}

                    {currentStep === 'prices' && (
                        <>
                            <CardHeader>
                                <CardTitle>Prices</CardTitle>
                                <CardDescription>Set up pricing for each product.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {products.filter((p) => p.name).length > 1 && (
                                    <div className="mb-4 flex gap-2">
                                        {products
                                            .filter((p) => p.name)
                                            .map((product, index) => (
                                                <Button
                                                    key={index}
                                                    variant={currentProductIndex === index ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setCurrentProductIndex(index)}
                                                >
                                                    {product.name}
                                                </Button>
                                            ))}
                                    </div>
                                )}

                                {products[currentProductIndex] && products[currentProductIndex].name && (
                                    <>
                                        <h3 className="font-semibold">
                                            Prices for: {products[currentProductIndex].name}
                                        </h3>
                                        {products[currentProductIndex].prices.map((price, priceIndex) => (
                                            <Card key={priceIndex} className="p-4">
                                                <div className="mb-4 flex items-start justify-between">
                                                    <Badge variant="outline">Price {priceIndex + 1}</Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() => removePrice(currentProductIndex, priceIndex)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Amount (in cents) *</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="1000"
                                                            value={price.unitAmount || ''}
                                                            onChange={(e) =>
                                                                updatePrice(currentProductIndex, priceIndex, {
                                                                    unitAmount: parseInt(e.target.value) || 0,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Currency</Label>
                                                        <Select
                                                            value={price.currency}
                                                            onValueChange={(value) =>
                                                                updatePrice(currentProductIndex, priceIndex, {
                                                                    currency: value,
                                                                })
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="usd">USD</SelectItem>
                                                                <SelectItem value="eur">EUR</SelectItem>
                                                                <SelectItem value="gbp">GBP</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Billing Interval</Label>
                                                        <Select
                                                            value={price.recurringInterval}
                                                            onValueChange={(value) =>
                                                                updatePrice(currentProductIndex, priceIndex, {
                                                                    recurringInterval: value as PriceInterval,
                                                                })
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="day">Daily</SelectItem>
                                                                <SelectItem value="week">Weekly</SelectItem>
                                                                <SelectItem value="month">Monthly</SelectItem>
                                                                <SelectItem value="year">Yearly</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Lookup Key</Label>
                                                        <Input
                                                            placeholder="monthly_pro"
                                                            className="font-mono"
                                                            value={price.lookupKey}
                                                            onChange={(e) =>
                                                                updatePrice(currentProductIndex, priceIndex, {
                                                                    lookupKey: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                        <Button variant="outline" onClick={() => addPrice(currentProductIndex)}>
                                            + Add Price
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </>
                    )}

                    {currentStep === 'review' && (
                        <>
                            <CardHeader>
                                <CardTitle>Review & Create</CardTitle>
                                <CardDescription>Review your plan configuration before creating.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h3 className="mb-2 font-semibold">Plan: {planName}</h3>
                                    {planDescription && (
                                        <p className="text-muted-foreground mb-4 text-sm">{planDescription}</p>
                                    )}

                                    <h4 className="mt-4 mb-2 font-medium">Products:</h4>
                                    {products
                                        .filter((p) => p.name)
                                        .map((product, index) => (
                                            <div key={index} className="mb-4 ml-4 rounded border p-3">
                                                <p className="font-medium">{product.name}</p>
                                                {product.description && (
                                                    <p className="text-muted-foreground text-sm">
                                                        {product.description}
                                                    </p>
                                                )}
                                                {product.prices.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-sm font-medium">Prices:</p>
                                                        <ul className="ml-4 list-disc">
                                                            {product.prices.map((price, priceIndex) => (
                                                                <li key={priceIndex} className="text-sm">
                                                                    {new Intl.NumberFormat('en-US', {
                                                                        style: 'currency',
                                                                        currency: price.currency.toUpperCase(),
                                                                    }).format(price.unitAmount / 100)}{' '}
                                                                    / {price.recurringInterval}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>

                {/* Navigation */}
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={goBack} disabled={currentStepIndex === 0}>
                        <IconArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    {currentStep === 'review' ? (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <IconCheck className="mr-2 h-4 w-4" />
                                    Create Plan
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button onClick={goNext} disabled={!canProceed()}>
                            Next
                            <IconArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </LayoutContent>
        </div>
    );
}
