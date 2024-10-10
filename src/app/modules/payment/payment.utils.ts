import axios from 'axios';
import config from '../../config';

export interface TPaymentInfo {
  trxId: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  paidStatus?: string;
}

export const initiatePayment = async (paymentData: TPaymentInfo) => {
  const res = await axios.post(config.payment_url!, {
    store_id: config.store_id,
    tran_id: paymentData.trxId,
    success_url: `http://localhost:5000/api/payments/confirmation?trxId=${paymentData.trxId}&status=success&email=${paymentData.customerEmail}`,
    fail_url: `http://localhost:5000/api/payments/confirmation?status=failed`,
    cancel_url: config.client_url,
    amount: paymentData.amount,
    currency: 'BDT',
    signature_key: config.signature_key,
    desc: 'Merchant Registration Payment',
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: paymentData.customerAddress,
    cus_add2: 'N/A',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1206',
    cus_country: 'Bangladesh',
    cus_phone: 'N/A',
    type: 'json',
  });

  return res.data;
};

export const verifyPayment = async (transactionId: string) => {
  const response = await axios.get(config.payment_verify_url!, {
    params: {
      store_id: config.store_id,
      signature_key: config.signature_key,
      type: 'json',
      request_id: transactionId,
    },
  });

  return response.data;
};
