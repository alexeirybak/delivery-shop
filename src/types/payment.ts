export type PaymentSimulationResult = 'success' | 'failure' | 'error';

export interface FakePaymentData {
  id: string;
  amount: number;
  cardLast4: string;
  timestamp: string;
  processor: string;
  status: 'succeeded' | 'failed';
}

export interface PaymentSuccessData {
  orderNumber: string;
  paymentId: string;
  amount: number;
  cardLast4: string;
}

export interface FakePaymentModalProps {
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentData: FakePaymentData) => void;
  onError: (error: string) => void;
}