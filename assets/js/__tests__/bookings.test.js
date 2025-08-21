import { jest } from '@jest/globals';

const addBookingMock = jest.fn(() => Promise.resolve({ id: 'booking123' }));
const addNotificationMock = jest.fn(() => Promise.resolve());

jest.mock('../auth.js', () => ({
  auth: { currentUser: null }
}));

jest.mock('../firebase-config.js', () => ({
  db: {
    collection: (name) => ({
      add: name === 'bookings' ? addBookingMock : addNotificationMock
    })
  },
  firebase: { firestore: { FieldValue: { serverTimestamp: jest.fn(() => 'timestamp') } } }
}));

import { createBooking } from '../bookings.js';
import { auth } from '../auth.js';

describe('createBooking', () => {
  test('throws error when user not authenticated', async () => {
    await expect(
      createBooking('t1', '2024-01-01', '10:00', '', 'presencial')
    ).rejects.toThrow('Usuario no autenticado');
  });

  test('creates booking when user is authenticated', async () => {
    auth.currentUser = { uid: 'user123' };

    const bookingId = await createBooking(
      't1',
      '2024-01-01',
      '10:00',
      'notes',
      'presencial'
    );

    expect(bookingId).toBe('booking123');
    expect(addBookingMock).toHaveBeenCalled();
    expect(addNotificationMock).toHaveBeenCalled();
  });
});
