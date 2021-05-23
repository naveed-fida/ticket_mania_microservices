import {Subjects} from "./subjects";
import {OrderStatus} from "./types/order-status";

interface TicketData {
  id: string;
  title: string;
  price: number;
  userId: string;
}

export interface Event {
  subject: Subjects;
  data: any;
}

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: TicketData
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated
  data: TicketData
}

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled,
  data: {
    id: string;
    ticket: {
      id: string;
    }
  }
};

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated,
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    }
  }
};

