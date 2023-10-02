import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { TicketStatus } from '.prisma/client';
import {
    createEnrollmentWithAddress,
    createUser,
    createTicket,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';

import app, { init } from '@/app';
import { createHotel } from '../factories/hotels-factory';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it("should respond with 404 if don't exists enrollment", async () => {
            const token = await generateValidToken();
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with 404 if don't exists ticket", async () => {
            const user = await createUser();
            await createEnrollmentWithAddress(user);
            const token = await generateValidToken(user);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with 404 when no hotel was found", async () => {
            const token = await generateValidToken();
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with 402 when ticket is not paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: false,
                },
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await createHotel()
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with 402 when ticket doesn't includes hotel", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: false,
                },
            });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createHotel("name", "image")

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            const hotelWithRooms = response.body

            expect(response.status).toEqual(expect.arrayContaining(hotelWithRooms));
            expect(response.status).toBe(httpStatus.OK);
        });
        it('should respond with 200 and return hotels', async () => {
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
            await createHotel('name', 'image');
            const result = await server.get('/hotels').set({
                Authorization: `Bearer ${token}`,
            });
            const hotelWithRooms = result.body;
            expect(result.status).toBe(httpStatus.OK);

            expect(result.body).toEqual(expect.arrayContaining(hotelWithRooms));
        });
    });
});