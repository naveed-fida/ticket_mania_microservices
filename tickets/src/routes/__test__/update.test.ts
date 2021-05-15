import request from 'supertest';
import mongoose from "mongoose";

import app from '../../app';

const createTicket = (attrs: {}) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(attrs);
};

it('sends a 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Something',
      price: 35
    }).expect(404);
});

it('sends a 401 if user is not authenticated', async () => {
  const response = await createTicket({ title: 'Some Event', price: 20 });
  const { id } = response.body;

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Something',
      price: 35
    }).expect(401);
});

it ('sends a 401 if the ticket does not belong to the user', async () => {
  let response = await createTicket({ title: 'Some Event', price: 20 });
  const { id } = response.body;

  response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin({id: 'asdf345kbd', email: 'nf@nf.com'}))
    .send({
      title: 'Another Event',
      price: 35
    }).expect(401);
});

it('sends a 400 if user provides invalid title or price', async () => {
  const response = await createTicket({ title: 'Some Event', price: 20 });
  const { id } = response.body;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 35
    }).expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Event 5',
      price: 0
    }).expect(400);
});

it('sends a 200 if user provides valid inputs', async () => {
  let response = await createTicket({ title: 'Some Event', price: 20 });
  const { id } = response.body;

  response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Another Event',
      price: 35
    }).expect(200);

  expect(response.body.title).toEqual('Another Event');
});