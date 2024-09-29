import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    user: z.string(),
    post: z.string(),
    content: z.string({ required_error: 'Please write something...!' }),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    content: z.string(),
  }),
});

export const commentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
