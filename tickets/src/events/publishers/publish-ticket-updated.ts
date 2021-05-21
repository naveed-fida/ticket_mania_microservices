import {NATSConnection, Subjects, TicketUpdatedEvent} from '@nf-ticket-mania/shared';

const publishTicketUpdated = (conn: NATSConnection, data: TicketUpdatedEvent['data']): Promise<void> => {
  return conn.publish<TicketUpdatedEvent>({
    subject: Subjects.TicketUpdated,
    data
  });
}

export { publishTicketUpdated };
