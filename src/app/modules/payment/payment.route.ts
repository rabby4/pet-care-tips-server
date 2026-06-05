import { Router } from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// payment history is for admins only
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  PaymentController.getPaymentInfo,
);

// gateway callback (identified by trxId, verified against the gateway)
router.post('/confirmation', PaymentController.confirmationController);

// starting a payment requires login
router.post('/monetization', auth(), PaymentController.paymentForMonetization);

export const PaymentRoutes = router;
