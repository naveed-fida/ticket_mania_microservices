import {Event} from '@nf-ticket-mania/shared'

export const natsClient = {
  publish: jest.fn().mockImplementation(() => {
    return new Promise<void>((resolve, _) => {
      resolve();
    });
  })
}