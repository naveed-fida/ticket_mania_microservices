import { Router, Request, Response }  from 'express';
import { body } from "express-validator";
import cookieSession from "cookie-session";

import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError} from "../errors/bad-request-error";
import { User } from "../models/user";
import { Password } from "../lib/password";
import jwt from "jsonwebtoken";

const router = Router();

const handlers = [
  body('email')
    .isEmail()
    .withMessage('Must supply a valid email'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Must supply a password'),

  validateRequest
]

const PATH = '/api/users/signin';
router.post(PATH, handlers, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('Email and/or Password Invalid!');
  }

  const passwordsMatch = await Password.compare(user.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Email and/or Password Invalid!');
  }

  const userJwt = jwt.sign(
    {id: user.id, email: user.email},
    process.env.JWT_KEY!
  );

  req.session = { jwt: userJwt }
  res.send(user);
});

export { router as SigninRouter };