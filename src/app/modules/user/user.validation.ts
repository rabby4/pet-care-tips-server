import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First Name is required' }),
    lastName: z.string({ required_error: 'Last Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please provide a valid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    address: z.string().optional(),
    occupation: z.string().optional(),
    about: z.string().optional(),
    image: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
    newPassword: z
      .string({
        required_error: 'New password is required!',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    occupation: z.string().optional(),
    about: z.string().optional(),
    image: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  updateUserValidationSchema,
};
