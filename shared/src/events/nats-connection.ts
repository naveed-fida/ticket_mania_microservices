import nats, {Stan, StanOptions} from "node-nats-streaming";
import {Listener, MessageCallback} from "./base-listener";
import {Event} from "./event-types";

export class NATSConnection {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('NATS connection not established yet.')
    }

    return this._client;
  }

  public connect(clusterID: string, clientId: string, options: StanOptions) {
    this._client = nats.connect(
      clusterID,
      clientId,
      options
    );

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log("Connected to NATS");
        resolve();

        this.handleProcessSignals();

        this.client.on('close', () => {
          console.log('NATS connection closed!');
          process.exit();
        });
      });

      this.client.on('error', (err) => reject(err))
    });
  }

  public createListener<T extends Event>(options: {
    subject: T['subject'],
    queueGroupName: string,
    onMessage: MessageCallback<T>
  }): Listener<T> {

    return new Listener<T>(this.client, options);
  }

  public publish<T extends Event>(options: {
    subject: T['subject'],
    data: T['data']
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const {subject, data} = options;

      this.client.publish(subject, JSON.stringify(data), (err, ) => {
        if (err) return reject(err);
        console.log('Event Published to subject: ' + subject);
        resolve();
      });
    });
  }

  private handleProcessSignals() {
    process.on('SIGINT', () => this.client.close());
    process.on('SIGTERM', () => this.client.close());
  }
}