import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'Please write something...!' }),
    image: z.string().optional(),
    category: z.string().optional(),
  }),
});
const updatePostValidationSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    upvote: z.string().optional(),
    downvote: z.string().optional(),
    premium: z.boolean().optional(),
  }),
});

export const postValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
