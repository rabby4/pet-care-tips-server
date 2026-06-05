import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    // the author is taken from the auth token, not the request body
    post: z.string({ required_error: 'Post id is required!' }),
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
