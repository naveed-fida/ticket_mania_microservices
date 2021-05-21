import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  validateRequest
} from "@nf-ticket-mania/shared";

import {validators} from "./lib/validators";
import Ticket from "../models/ticket";
import {publishTicketUpdated} from "../events/publishers/publish-ticket-updated";
import {natsClient} from "../nats-client";

const router = express.Router();

const middlewares = [
  requireAuth,
  ...validators,
  validateRequest
]

router.put('/api/tickets/:id', middlewares, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  if (req.currentUser!.id !== ticket.userId) {
    throw new NotAuthorizedError();
  }

  const {title, price } = req.body;
  ticket.set({title, price});
  await ticket.save();

  await publishTicketUpdated(natsClient, {
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })

  res.status(200).send(ticket);
});

export {router as updateRouter};