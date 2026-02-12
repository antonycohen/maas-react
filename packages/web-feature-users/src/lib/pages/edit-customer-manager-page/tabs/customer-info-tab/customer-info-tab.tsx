import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditCustomerOutletContext } from '../../edit-customer-manager-page';
import { CustomerFormValues } from '../../hooks';

export const CustomerInfoTab = () => {
    const { isLoading } = useOutletContext<EditCustomerOutletContext>();

    const { ControlledTextInput, ControlledTextAreaInput, ControlledCountryInput } =
        createConnectedInputHelpers<CustomerFormValues>();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <LayoutContent>
            <div className="flex flex-col gap-6">
                {/* Customer Information */}
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Customer Information</CardTitle>
                        <CardDescription>General customer details.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="flex flex-col divide-y">
                            <ControlledTextInput name="name" label="Name" direction="horizontal" className="py-6" />
                            <ControlledTextInput
                                name="email"
                                label="Email"
                                direction="horizontal"
                                className="py-6"
                                readOnly
                            />
                            <ControlledTextInput name="phone" label="Phone" direction="horizontal" className="py-6" />
                            <ControlledTextAreaInput
                                name="description"
                                label="Description"
                                direction="horizontal"
                                maxLength={500}
                                className="py-6"
                            />
                            <ControlledTextInput
                                name="currency"
                                label="Currency"
                                direction="horizontal"
                                className="py-6"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Billing & Delivery Addresses */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Billing Address */}
                    <Card className="gap-0 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl">Billing Address</CardTitle>
                            <CardDescription>Customer billing address.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pt-2">
                            <div className="flex flex-col divide-y">
                                <ControlledTextInput
                                    name="billingAddress.name"
                                    label="Name"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.line1"
                                    label="Address Line 1"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.line2"
                                    label="Address Line 2"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.city"
                                    label="City"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="billingAddress.postalCode"
                                    label="Postal Code"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledCountryInput
                                    name="billingAddress.country"
                                    label="Country"
                                    direction="horizontal"
                                    className="py-6"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Address */}
                    <Card className="gap-0 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl">Delivery Address</CardTitle>
                            <CardDescription>Customer delivery/shipping address.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pt-2">
                            <div className="flex flex-col divide-y">
                                <ControlledTextInput
                                    name="shippingAddress.firstName"
                                    label="First Name"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.lastName"
                                    label="Last Name"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.line1"
                                    label="Address Line 1"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.line2"
                                    label="Address Line 2"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.city"
                                    label="City"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledTextInput
                                    name="shippingAddress.postalCode"
                                    label="Postal Code"
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledCountryInput
                                    name="shippingAddress.country"
                                    label="Country"
                                    direction="horizontal"
                                    className="py-6"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </LayoutContent>
    );
};
