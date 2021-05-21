import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@nf-ticket-mania/shared';
import {validators} from "./lib/validators";
import Ticket from "../models/ticket";
import {natsClient} from "../nats-client";
import {publishTicketCreated} from "../events/publishers/publish-ticket-created";

const router = express.Router();

const middlewares = [
  requireAuth,
  ...validators,
  validateRequest
];


router.post('/api/tickets', middlewares, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  });

  await ticket.save();

  await publishTicketCreated(natsClient, {
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })

  res.status(201).send(ticket);
});

export { router as createTicketRouter };