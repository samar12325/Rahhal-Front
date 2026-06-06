import { apiRequest } from '../api/client'

export const checkoutBooking = async ({
  tripId,
  destinationId,
  date,
  time,
  people,
  paymentMethod,
  amount,
}) =>
  apiRequest('/bookings/checkout', {
    method: 'POST',
    body: {
      tripId: Number(tripId),
      destinationId: Number(destinationId),
      date,
      time,
      people: Number(people),
      paymentMethod,
      ...(amount !== undefined ? { amount: Number(amount) } : {}),
    },
  })
