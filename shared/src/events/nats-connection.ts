import nats, {Stan, StanOptions} from "node-nats-streaming";
import {Listener, MessageCallback} from "./base-listener";
import {Event} from "./event-types";
import {EventEmitter} from 'events';

export class NATSConnection {
  private client?: Stan;

  constructor() {
    this.handleProcessSignals();
  }

  public connect(clusterID: string, clientId: string, options: StanOptions) {
    this.client = nats.connect(
      clusterID,
      clientId,
      options
    );

    return new Promise<void>((resolve, reject) => {
      this.client!.on('connect', () => {
        console.log("Connected to NATS");
        resolve();

        this.client!.on('close', () => {
          console.log('NATS connection closed!');
        });
      });

      this.client!.on('error', (err) => reject(err))
    });
  }

  public addNewListener<T extends Event>(options: {
    subject: T['subject'],
    queueGroupName: string,
    onMessage: MessageCallback<T>
  }): Listener<T> {
    return new Listener<T>(this.client!, options);
  }

  public publish<T extends Event>(options: {
    subject: T['subject'],
    data: T['data']
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const {subject, data} = options;

      this.client!.publish(subject, JSON.stringify(data), (err, ) => {
        if (err) return reject(err);
        console.log('Event Published to subject: ' + subject);
        resolve()
      });
    });
  }

  private handleProcessSignals() {
    process.on('SIGINT', () => this.client!.close());
    process.on('SIGTERM', () => this.client!.close());
  }
}