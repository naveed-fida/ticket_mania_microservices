import express, {Request, Response} from 'express';
import {NotAuthorizedError, NotFoundError, requireAuth} from "@nf-ticket-mania/shared";
import {Order, OrderStatus} from "../models/order";

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req. currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  res.sendStatus(204);
});

export { router as deleteOrderRouter };