import crypto from 'crypto';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from '../user/user.model';
import { initiatePayment, TPaymentInfo, verifyPayment } from './payment.utils';
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { Payment } from './payment.model';

// the premium price is fixed on the server; the client can't choose what to pay
const PREMIUM_PRICE = Number(config.premium_price) || 100;

const buildResultPage = (isSuccess: boolean) => {
  return `
    <html>
      <head>
        <style>
        * {
            margin: 0;
            padding: 0;
            font-family: 'Inter'
          }
          .main {
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
          }
          .main h2 {
            font-size: 40px;
            font-family: "Orbitron";
          }
          .main p {
            font-size: 18px;
            font-family: "Inter";
          }
          .main a {
            font-size: 16px;
            font-family: "Orbitron";
            text-decoration: none;
            color: #fff;
            padding: 20px 55px;
            font-weight: 600;
            transition: 0.5s;
          }
          .main a:hover {
            background: #0f0f0f;
            color: #fff;
            padding: 20px 55px;
            font-weight: 600;
          }

          .success {
            color: #111;
          }
          .cancel {
            color: #f5a524;
          }
          .redirect-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            color: #fff;
          }
          .success-link {
            background-color: #17c964;
          }
          .cancel-link {
            background-color: #f5a524;
          }
        </style>
      </head>

      <body>
        <div class="main">
          <h2>Your payment is ${isSuccess ? 'Successful' : 'Canceled'}</h2>
          <p>${
            isSuccess
              ? 'We received your payment. Now you can go home page'
              : 'The payment could not be verified. Please try again.'
          }</p>
          <a href="${config.client_url}" class="redirect-link ${isSuccess ? 'success-link' : 'cancel-link'}">
            ${isSuccess ? 'Go to Home' : 'Try Again Payment'}
          </a>
        </div>
      </body>
    </html>
  `;
};

// gateway callback: identify the order by trxId, verify with the gateway,
// and only then grant premium to the user stored on the payment record
const confirmationService = async (trxId?: string) => {
  let isSuccess = false;

  if (trxId) {
    const payment = await Payment.findOne({ trxId });

    if (payment) {
      if (payment.status === 'successful') {
        // already processed (replayed callback) - nothing more to do
        isSuccess = true;
      } else {
        let verifyResponse;
        try {
          verifyResponse = await verifyPayment(trxId);
        } catch {
          // gateway unreachable -> mark failed, never grant premium
          verifyResponse = null;
        }

        // fail closed: a missing/unparseable amount counts as not verified
        const verifiedAmount = Number(
          String(verifyResponse?.amount ?? '').replace(/[^\d.]/g, ''),
        );
        const amountOk =
          !Number.isNaN(verifiedAmount) && verifiedAmount >= payment.amount;

        if (verifyResponse?.pay_status === 'Successful' && amountOk) {
          // one-shot transition so racing callbacks can't double-process
          // or resurrect a record another callback already marked failed
          const updated = await Payment.updateOne(
            { trxId, status: 'pending' },
            { status: 'successful' },
          );

          if (updated.modifiedCount === 1) {
            await User.findByIdAndUpdate(payment.userId, { premium: true });
          }
          isSuccess = true;
        } else {
          await Payment.updateOne(
            { trxId, status: 'pending' },
            { status: 'failed' },
          );
        }
      }
    }
  }

  return buildResultPage(isSuccess);
};

// the paying user comes from the auth token; premium is granted ONLY after
// the gateway confirms the payment (see confirmationService)
const paymentForMonetization = async (requester: JwtPayload) => {
  const isExistUser = await User.findById(requester.id);

  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (isExistUser.premium) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You are already a premium member',
    );
  }

  // non-guessable transaction id
  const trxId = `TrxID-${crypto.randomBytes(10).toString('hex')}`;

  const paymentInfo: TPaymentInfo = {
    trxId,
    amount: PREMIUM_PRICE,
    customerName: `${isExistUser.firstName} ${isExistUser.lastName}`,
    customerEmail: isExistUser.email,
    customerPhone: isExistUser.phone || 'not available',
    customerAddress: isExistUser.address,
  };

  const paymentSession = await initiatePayment(paymentInfo);

  const result = await Payment.create({
    userId: isExistUser._id,
    trxId,
    email: isExistUser.email,
    amount: PREMIUM_PRICE,
    status: 'pending',
  });

  return {
    result,
    paymentSession,
  };
};

const getPaymentInfoUser = async () => {
  const payment = await Payment.find();
  return payment;
};

export const PaymentServices = {
  confirmationService,
  paymentForMonetization,
  getPaymentInfoUser,
};
