import { User } from './models';
import { imageShape } from '../image';

export const mockUser: User = {
    id: '2684784',
    email: 'user@test.com',
    firstName: 'User',
    lastName: 'Test',
    status: 'ACTIVE',
    profileImage: imageShape,
    socialIdentifiers: null,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    localizationPreferences: null,
    roles: null,
    notificationsPreferences: null,
    locale: null,
};
