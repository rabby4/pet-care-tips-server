import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.get('/', PaymentController.getPaymentInfo);
router.post('/confirmation', PaymentController.confirmationController);
router.post('/monetization', PaymentController.paymentForMonetization);

export const PaymentRoutes = router;
