import {OrderCreatedEvent, Subjects, NATSConnection} from "@nf-ticket-mania/shared";

import {natsClient} from "../../nats-client";

export function publishOrderCreated(
  client: NATSConnection,
  data: OrderCreatedEvent['data']
): Promise<void> {
  return natsClient.publish<OrderCreatedEvent>(
    {
      subject: Subjects.OrderCreated,
      data
    }
  );
}