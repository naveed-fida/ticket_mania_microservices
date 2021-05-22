import express, {Request, Response} from 'express';
import {requireAuth, validateRequest} from '@nf-ticket-mania/shared';
import {body} from "express-validator";

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

router.post('/api/orders/', middlewares, (req: Request, res: Response) => {
  res.send({});
});

export { router as createOrderRouter };