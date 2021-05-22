export enum OrderStatus {
  // order created but associated ticket hasn't been reserved
  Created = 'created',
  // If the associated ticket has already been reserved
  // or the user cancels order or the order expires before payment
  Cancelled = 'cancelled',
  // The order has reserved ticket but the user hasn't payed yet
  AwaitingPayment = 'awaiting:payment',
  // The order has reserved ticket and the user provides payment
  Completed = 'completed'
};