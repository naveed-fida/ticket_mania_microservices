import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(payload?: {id: string, email: string}): string[]
    }
  }
}

let mongo: any;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  process.env.JWT_KEY = 'something';
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = (payload = {
  id: '1k1k4jf9m1',
  email: 'test@test.com'
}) => {
  const sessionJSON = JSON.stringify({
      jwt: jwt.sign(payload, process.env.JWT_KEY!)
  });

  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`express:sess=${base64}`];
};