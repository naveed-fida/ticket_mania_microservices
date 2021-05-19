import nats, {Stan, StanOptions} from "node-nats-streaming";
import {Listener, MessageCallback} from "./base-listener";
import {Event} from "./event-types";
import {EventEmitter} from 'events';

export class NATSConnection extends EventEmitter {
  private client: Stan;
  private myListeners: Listener<any>[] = [];

  constructor(clusterID: string, clientId: string, options: StanOptions) {
    super();

    this.client = nats.connect(
      clusterID,
      clientId,
      options
    );

    this.handleLifeCycleEvents();
    this.handleProcessSignals();
  }

  handleLifeCycleEvents() {
    this.client.on('connect', () => {
      console.log("Connected to NATS");
      this.myListeners.forEach((l) => l.subscribe());
      this.emit('connect');
      this.client.on('close', () => {
        console.log('NATS connection closed!');
      });
    });
  }

  public addNewListener<T extends Event>(options: {
    subject: T['subject'],
    queueGroupName: string,
    onMessage: MessageCallback<T>
  }) {
    const listener = new Listener<T>(this.client, options);
    this.myListeners.push(listener);
  }

  publish<T extends Event>(options: {
    subject: T['subject'],
    data: T['data']
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const {subject, data} = options;

      this.client.publish(subject, JSON.stringify(data), (err, ) => {
        if (err) return reject(err);
        console.log('Event Published to subject: ' + subject);
        resolve()
      });
    });
  }

  handleProcessSignals() {
    process.on('SIGINT', () => this.client.close());
    process.on('SIGTERM', () => this.client.close());
  }
}