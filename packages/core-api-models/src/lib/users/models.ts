import * as z from 'zod';
import { readImageSchema, updateImageSchema } from '../image';

// Enums
export const userStatus = z.enum([
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED',
]);
export type UserStatus = z.infer<typeof userStatus>;

// 1. Reference schema with label field (for dropdowns, selects, links)
export const readUserRefSchema = z.object({
  id: z.uuid(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  bio: z.string().nullable(),
  email: z.string().optional(),
  profileImage: z.object(readImageSchema).optional().nullable(),
});
export type ReadUserRef = z.infer<typeof readUserRefSchema>;

// 2. Minimal reference schema (for foreign keys)
export const userRefSchema = z.object({
  id: z.uuid(),
});
export type UserRef = z.infer<typeof userRefSchema>;

// 3. Read schema - all properties nullable (API response)
export const readUserSchema = z.object({
  id: z.uuid().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  status: userStatus.nullable(),
  profileImage: z.object(readImageSchema).nullable(),
  socialIdentifiers: z.record(z.string(), z.string()).nullable(),
  createdAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime().nullable(),
  localizationPreferences: z
    .object({
      language: z.string().nullable(),
      timezone: z.string().nullable(),
      dateFormat: z.string().nullable(),
    })
    .nullable(),
  notificationsPreferences: z
    .object({
      channels: z.object({
        products: z.boolean(),
        news: z.boolean(),
      }),
    })
    .nullable(),
});
export type ReadUser = z.infer<typeof readUserSchema>;

// 4. Create schema - based on DTO serialization groups (View.Create)
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .max(250, 'First name must be at most 250 characters.'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(250, 'Last name must be at most 250 characters.'),
  email: z
    .email('Invalid email format.')
    .min(5, 'Email must be at least 5 characters.')
    .max(250, 'Email must be at most 250 characters.'),
  password: z.string().optional(),
  profileImage: updateImageSchema.nullable().optional(),
});
export type CreateUser = z.infer<typeof createUserSchema>;

// 5. Update schema - based on DTO serialization groups (View.Update)
export const updateUserInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .max(250, 'First name must be at most 250 characters.')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(250, 'Last name must be at most 250 characters.')
    .optional(),
  profileImage: updateImageSchema.nullable().optional(),
});
export type UpdateUserInfo = z.infer<typeof updateUserInfoSchema>;

// Legacy export for backward compatibility
export const userSchema = readUserSchema;
export type User = ReadUser;

export const changeEmailRequestSchema = z.object({
  newEmail: z
    .email('Invalid email format.')
    .min(5, 'Email must be at least 5 characters.')
    .max(250, 'Email must be at most 250 characters.'),
});
export type ChangeEmailRequest = z.infer<typeof changeEmailRequestSchema>;

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z
      .string()
      .min(0, 'Current password must be at least 8 characters.')
      .max(128, 'Current password must be at most 128 characters.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters.')
      .max(128, 'New password must be at most 128 characters.'),
    repeatNewPassword: z
      .string()
      .min(8, 'Repeat new password must be at least 8 characters.')
      .max(128, 'Repeat new password must be at most 128 characters.'),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: 'New passwords do not match.',
    path: ['repeatNewPassword'],
  });

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

export const updateLocalizationPreferencesSchema = z.object({
  localizationPreferences: z.object({
    language: z.string().nullable(),
    timezone: z.string().nullable(),
    dateFormat: z.string().nullable(),
  }),
});

export type UpdateLocalizationPreferences = z.infer<
  typeof updateLocalizationPreferencesSchema
>;

export const updateNotificationsPreferencesSchema = z.object({
  notificationsPreferences: z.object({
    channels: z.object({
      products: z.boolean(),
      news: z.boolean(),
    }),
  }),
});

export type UpdateNotificationsPreferences = z.infer<
  typeof updateNotificationsPreferencesSchema
>;
