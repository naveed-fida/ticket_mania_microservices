import {OrderCancelledEvent, Subjects, NATSConnection} from "@nf-ticket-mania/shared";

import {natsClient} from "../../nats-client";

export function publishOrderCancelled(
  client: NATSConnection,
  data: OrderCancelledEvent['data']
): Promise<void> {
  return natsClient.publish<OrderCancelledEvent>(
    {
      subject: Subjects.OrderCancelled,
      data
    }
  );
}
