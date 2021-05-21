import express from "express";
import morgan from "morgan";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from "@nf-ticket-mania/shared";

import {createTicketRouter} from "./routes/create";
import {showTicketRouter} from "./routes/show";
import {indexRouter} from "./routes";
import {updateRouter} from "./routes/update";

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexRouter);
app.use(updateRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;