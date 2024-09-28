import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First Name is required' }),
    lastName: z.string({ required_error: 'Last Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    phone: z.string().optional(),
    address: z.string().optional(),
    occupation: z.string().optional(),
    about: z.string().optional(),
    image: z.string().optional(),
    role: z.string().optional(),
    followers: z.string().optional(),
    following: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

// const changeStatusValidationSchema = z.object({
//   body: z.object({
//     status: z.enum([...UserStatus] as [string, ...string[]]),
//   }),
// });

export const UserValidation = {
  createUserValidationSchema,
  loginValidationSchema,
  // changeStatusValidationSchema,
};
