import {NATSConnection, Subjects, TicketCreatedEvent} from '@nf-ticket-mania/shared';

const publishTicketCreated = (conn: NATSConnection, data: TicketCreatedEvent['data']): Promise<void> => {
  return conn.publish<TicketCreatedEvent>({
    subject: Subjects.TicketCreated,
    data
  });
}

export { publishTicketCreated };
