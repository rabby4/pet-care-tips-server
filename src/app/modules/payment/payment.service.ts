import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from '../user/user.model';
import { initiatePayment, TPaymentInfo, verifyPayment } from './payment.utils';
import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { Payment } from './payment.model';
import { TPayment } from './payment.interface';

const confirmationService = async (
  trxId: string,
  status: string,
  email: string,
) => {
  const verifyResponse = await verifyPayment(trxId);

  if (verifyResponse && verifyResponse?.pay_status === 'Successful') {
    await User.findOneAndUpdate(
      { email },
      {
        premium: true,
      },
      { new: true },
    );
  }

  const successTemplate = `
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
			    <h2>Your payment is ${status === 'success' ? 'Successful' : 'Canceled'}</h2>
			    <p>We received your payment. Now you can go home page</p>
			    <a href="${config.client_url}" class="redirect-link ${status === 'success' ? 'success-link' : 'cancel-link'}">
            ${status === 'success' ? 'Go to Home' : 'Try Again Payment'}
          </a>
		    </div>
	    </body>
    </html>
  `;

  return successTemplate;
};

const paymentForMonetization = async (payload: TPayment) => {
  const isExistUser = await User.findOne({ email: payload.email });

  if (!isExistUser) {
    throw new AppError(httpStatus.OK, 'User not found');
  }

  if (isExistUser.premium) {
    throw new AppError(httpStatus.OK, 'You are already a premium member');
  }

  const trxId = `TrxID-${Date.now()}`;

  const paymentInfo: TPaymentInfo = {
    trxId,
    amount: payload.amount,
    customerName: `${isExistUser.firstName} ${isExistUser.lastName}`,
    customerEmail: isExistUser.email,
    customerPhone: isExistUser.phone || 'not available',
    customerAddress: isExistUser.address,
  };

  const paymentSession = await initiatePayment(paymentInfo);

  const result = await Payment.create({
    userId: isExistUser._id,
    trxId,
    email: payload.email,
    amount: payload.amount,
  });

  if (isExistUser) {
    await User.findOneAndUpdate(
      { email: payload.email },
      {
        premium: true,
      },
    );
  }

  return {
    result,
    paymentSession,
  };
};

const getPaymentInfoUser = async (loggerUser: JwtPayload) => {
  const payment = await User.findOne({
    email: loggerUser.email,
    premiumMember: true,
  });

  if (!payment) {
    throw new AppError(httpStatus.OK, 'User not found');
  }

  return payment;
};

export const PaymentServices = {
  confirmationService,
  paymentForMonetization,
  getPaymentInfoUser,
};
