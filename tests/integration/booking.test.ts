import app, { init } from '@/app';
import supertest from 'supertest';
import { prisma } from '@/config';
import * as jwt from 'jsonwebtoken';
import faker from '@faker-js/faker';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoomWithHotelId,
  createTicket,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it("should respond with 404 if don't exists booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and return booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: faker.datatype.boolean(),
        },
      });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: expect.objectContaining({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });;

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if the roomId doesnt exists ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      })
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when the room is full', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = prisma.room.create({
        data: {
          name: '9999',
          capacity: 0,
          hotelId: hotel.id,
        },
      });

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: (await room).id });
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when doesnt include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: false,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when the user ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: true,
        },
      });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when the ticket isnt paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      })
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const payment = await createPayment(ticket.id, ticketType.price);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and with bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });
  });
});
describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 when is it updated', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        }
      })
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const newRoom = await createRoomWithHotelId(hotel.id);

      const response = await server.put(`/booking/${booking.id}`)
      .set('Authorization', `Bearer ${token}`).send({roomId: newRoom.id});
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: booking.id,
      });
    });
  });
});