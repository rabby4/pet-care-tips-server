import { z } from 'zod';

const paymentValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Amount is required' }),
    amount: z.number({ required_error: 'Amount is required' }),
  }),
});

export const PaymentValidation = {
  paymentValidationSchema,
};
