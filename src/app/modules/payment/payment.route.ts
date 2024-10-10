import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';
import validationRequest from '../../middleware/validationRequest';

const router = Router();

router.post('/confirmation', PaymentController.confirmationController);
router.post(
  '/monetization',
  // auth('admin', 'user'),
  // validationRequest(PaymentValidation.paymentValidationSchema),
  PaymentController.paymentForMonetization,
);

router.get('/info', PaymentController.getPaymentInfo);

export const PaymentRoutes = router;
