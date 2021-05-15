import request from 'supertest';
import app from '../../app';

const createTicket = (attrs: {}) => {
   return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(attrs);
}

it ('can fetch a list of tickets', async () => {
  await createTicket({title: 'Event 1', price: 20});
  await createTicket({title: 'Event 2', price: 25});
  await createTicket({title: 'Event 3', price: 15});

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});