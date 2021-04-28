import { Router, Request, Response }  from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from "@nf-ticket-mania/shared";

import { User } from '../models/user';

const router = Router();

const handlers = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid!'),

  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),

  validateRequest
];

const PATH = '/api/users/signup';
router.post(PATH, handlers, async (req: Request, res: Response) => {

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('email already in use');
  }

  const user = User.build({ email, password });
  await user.save();
  // generate json web token and store in session
  const userJwt = jwt.sign(
    {id: user.id, email: user.email},
    process.env.JWT_KEY!
  );

  req.session = { jwt: userJwt }
  res.status(201).send(user.toJSON());
});

export { router as SignupRouter };