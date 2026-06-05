import { PaymentServices } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const confirmationController = catchAsync(async (req, res) => {
  const { trxId } = req.query;

  // only the transaction id is trusted; the user/status are resolved server-side
  const result = await PaymentServices.confirmationService(
    trxId as string | undefined,
  );
  res.send(result);
});

const paymentForMonetization = catchAsync(async (req, res) => {
  // the paying user comes from the verified token, not the request body
  const result = await PaymentServices.paymentForMonetization(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment session initiated successfully',
    data: result,
  });
});

const getPaymentInfo = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentInfoUser();

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
