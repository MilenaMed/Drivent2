import { ApplicationError } from '@/protocols';

export function paymentRequired(): ApplicationError {
  return {
    name: 'paymentRequired',
    message: 'Payment required',
  };
}
