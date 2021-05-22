import express, {Request, Response} from 'express';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@nf-ticket-mania/shared';
import {body} from "express-validator";

import {Ticket} from "../models/ticket";
import {Order} from "../models/order";

const EXPIRATION_WINDOW_SECOND = 15 * 60;

const router = express.Router();

const validators = [
  body('ticketId')
    .not()
    .isEmpty()
    .withMessage('Ticket ID must be provided!')
]

const middlewares = [
  requireAuth,
  ...validators,
  validateRequest
]

router.post('/api/orders/', middlewares, async (req: Request, res: Response) => {
  const {ticketId} = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError('Ticket already taken!');
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOND);

  const order = new Order({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });

  await order.save();

  res.status(201).send(order);
});

export { router as createOrderRouter };