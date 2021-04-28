import express from "express";
import morgan from "morgan";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import 'express-async-errors';

import {CurrentUserRouter} from "./routes/current-user";
import {SigninRouter} from "./routes/signin";
import {SignoutRouter} from "./routes/signout";
import {SignupRouter} from "./routes/signup";
import {NotFoundError} from "./errors/not-found-error";
import {errorHandler} from "./middlewares/error-handler";

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

app.use(CurrentUserRouter);
app.use(SigninRouter);
app.use(SignoutRouter);
app.use(SignupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;