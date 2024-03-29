import mongoose from 'mongoose';

import app from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No 'JWT_KEY' environment variable found..");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("No 'MONGO_URI' environment variable found..");
  }

  try {
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