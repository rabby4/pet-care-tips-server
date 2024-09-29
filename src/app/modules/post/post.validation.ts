import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'Please write something...!' }),
    image: z.string().optional(),
  }),
});
const updatePostValidationSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const BikeValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
