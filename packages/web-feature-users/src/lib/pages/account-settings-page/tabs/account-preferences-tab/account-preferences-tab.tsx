import { useOutletContext } from 'react-router-dom';
import { EditUserOutletContext } from '../../types';
import { UpdateLocalizationPreferencesSection } from './components/update-localization-preferences-section';
import { UpdateNotificationsPreferencesSection } from './components/update-notifications-preferences-section';

export const AccountPreferencesTab = () => {
  const { user, isLoading } = useOutletContext<EditUserOutletContext>();

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <UpdateLocalizationPreferencesSection user={user} />
      <UpdateNotificationsPreferencesSection user={user} />
    </div>
  );
};
