import {Message, Stan} from "node-nats-streaming";

import {Event} from "./event-types";

export type MessageCallback<T extends Event> = (data: T['data'], message: Message) => void;

export class Listener<T extends Event> {
  private client: Stan;
  private subject: T['subject'];
  private queueGroupName: string;
  private ackWait = 5 * 1000;
  private onMessage: MessageCallback<T>

  constructor(client: Stan, options: {
    subject: T['subject'],
    ackWait?: number,
    queueGroupName: string
    onMessage: MessageCallback<T>
  }) {
    this.client = client;
    this.subject = options.subject;
    this.queueGroupName = options.queueGroupName;
    this.onMessage = options.onMessage;
    this.ackWait = options.ackWait || this.ackWait;
  }

  public subscribe() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (message: Message) => {
      console.log(`Message Recieved: ${this.subject} / ${this.queueGroupName}`);
      this.onMessage(this.parseMessage(message), message)
      message.ack();
    })
  }

  private subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);
  }

  private parseMessage(message: Message): string {
    const data = message.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }
}