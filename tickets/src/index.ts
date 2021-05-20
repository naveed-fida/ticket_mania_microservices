import mongoose from 'mongoose';

import app from './app';
import {natsClient} from "./nats-client";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No 'JWT_KEY' environment variable found..");
  }

  try {
    await natsClient.connect('ticketing', 'skldflas', 'http://nats-srv:4222');
    
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
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