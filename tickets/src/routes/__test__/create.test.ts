import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';

import {natsClient} from "../../nats-client";

it ("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(404);
});

it ("can only be accessed if the user is signed in", async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it ('returns a status other than 401 if the user is signed in', async() => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it ("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({title: '', price: 10})
    .expect(400);
});

it ("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({title: 'dfasdfas', price: -10})
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({title: 'asdfadsfd'})
    .expect(400);
});

it ("creates a ticket with valid data", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({title: 'asdfadsfd', price: 20})
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it ("publishes a 'ticket:created' event", async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({title: 'asdfadsfd', price: 20})
    .expect(201);

  expect(natsClient.publish).toHaveBeenCalled();
  expect((natsClient.publish as jest.Mock).mock.calls[0][0])
    .toMatchObject({subject: 'ticket:created'});
});