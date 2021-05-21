import express from "express";
import morgan from "morgan";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from "@nf-ticket-mania/shared";

import {deleteOrderRouter} from "./routes/delete";
import {showOrderRouter} from "./routes/show";
import {indexOrderRouter} from "./routes";
import {createOrderRouter} from "./routes/create";

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

app.use(currentUser);
app.use(createOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;