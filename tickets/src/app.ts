import express from "express";
import morgan from "morgan";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import 'express-async-errors';
import { NotFoundError, errorHandler } from "@nf-ticket-mania/shared";

const app = express();
app.set("trust proxy", true);
app.use(morgan('combined', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;