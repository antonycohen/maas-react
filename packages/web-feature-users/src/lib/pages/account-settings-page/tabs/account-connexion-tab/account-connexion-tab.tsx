import { useOutletContext } from 'react-router';
import { EditUserOutletContext } from '../../types';
import { ChangePasswordSection } from './components/change-password-section';
import { ProfileNameSection } from './components/profile-name-section';
import { EmailDisplaySection } from './components/email-display-section';

export const AccountConnexionTab = () => {
    const { user, isLoading } = useOutletContext<EditUserOutletContext>();

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col gap-6">
            <ProfileNameSection user={user} />
            <EmailDisplaySection user={user} />
            <ChangePasswordSection user={user} />
        </div>
    );
};
