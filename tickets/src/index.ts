import mongoose from 'mongoose';

import app from './app';
import {natsClient} from "./nats-client";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No 'JWT_KEY' environment variable found..");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("No 'MONGO_URI' environment variable found..");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("No 'NATS_CLUSTER_ID' environment variable found..");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("No 'NATS_CLIENT_ID' environment variable found..");
  }

  if (!process.env.NATS_URL) {
    throw new Error("No 'NATS_URL' environment variable found..");
  }

  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      {url: process.env.NATS_URL});

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => console.log('Listening on PORT 3000!'));
}

start();