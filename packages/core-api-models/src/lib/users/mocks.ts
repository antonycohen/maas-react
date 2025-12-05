import { User } from './models';
import { imageShape } from '../image';

export const mockUser: User = {
  id: '2684784',
  email: 'user@test.com',
  phoneNumber: '+33611223344',
  firstName: 'User',
  lastName: 'Test',
  profileImage: imageShape,
  coverImage: imageShape,
  roles: ['admin', 'editor'],
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z'),
  locale: 'en-US',
};
