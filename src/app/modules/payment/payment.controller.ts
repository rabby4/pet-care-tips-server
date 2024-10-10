import { Request, Response } from 'express';
import { PaymentServices } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const confirmationController = async (req: Request, res: Response) => {
  const { trxId, status, email } = req.query;

  const result = await PaymentServices.confirmationService(
    trxId as string,
    status as string,
    email as string,
  );
  res.send(result);
};

const paymentForMonetization = catchAsync(async (req, res) => {
  const result = await PaymentServices.paymentForMonetization(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment session initiated successfully',
    data: result,
  });
});

const getPaymentInfo = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentInfoUser(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment info fetched successfully',
    data: result,
  });
});

export const PaymentController = {
  confirmationController,
  paymentForMonetization,
  getPaymentInfo,
};
