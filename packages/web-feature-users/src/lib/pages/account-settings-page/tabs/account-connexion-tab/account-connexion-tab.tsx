import { useOutletContext } from 'react-router';
import { EditUserOutletContext } from '../../types';
import { ChangeEmailSection } from './components/change-email-section';
import { ChangePasswordSection } from './components/change-password-section';

export const AccountConnexionTab = () => {
    const { user, isLoading } = useOutletContext<EditUserOutletContext>();

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col gap-6">
            {/* <SsoConnectSection user={user} /> */}
            <ChangeEmailSection user={user} />
            <ChangePasswordSection user={user} />
        </div>
    );
};
