import { ApplicationError } from '@/protocols';

export function tickedNotFoundError(): ApplicationError {
  return {
    name: 'TicketNotFoundError',
    message: 'ticked type id required',
  };
}
