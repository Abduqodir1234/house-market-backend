import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import { fakeSignInData, fakeUserData } from './auth.e2e-spec';
import { PrismaClient } from '@prisma/client';

let token = '';

const fakeRoomData = {
  price: Math.floor(Math.random() * 1000),
  latitude: Math.random() * 100,
  longitude: Math.random() * 100,
  address: 'Yangiobod Mahallah Shaykhontohur District, Tashkent',
  area: 150,
};

const tokenReturner = async (app: INestApplication) => {
  await request(app.getHttpServer()).post('/auth/signup').send(fakeUserData);
  const res = await request(app.getHttpServer())
    .post('/auth/signin')
    .send(fakeSignInData);

  token = res.body.access_token;
};

describe('Houses (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await tokenReturner(app);
  });

  afterEach(async () => {
    const prisma = new PrismaClient();
    await prisma.users.deleteMany({ where: { email: fakeUserData.email } });
  });

  describe('Create House API', () => {
    const url = '/house';
    it('create api working correctly', () => {
      request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${token}`)
        .send(fakeRoomData)
        .expect(201)
        .expect({ error: false, message: 'Created' });
    });

    it('send empty body', () => {
      request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
        .expect({
          error: true,
          message: {
            statusCode: 400,
            message: [
              'price must be a number string',
              'price should not be empty',
              'longitude must be a longitude string or number',
              'longitude should not be empty',
              'latitude must be a latitude string or number',
              'latitude should not be empty',
              'address must be a string',
              'address should not be empty',
              'area must be a number string',
              'area should not be empty',
            ],
            error: 'Bad Request',
          },
        });
    });

    it('send data without token', () => {
      request(app.getHttpServer())
        .post(url)
        .expect(400)
        .expect({ error: true, message: 'Unauthorized' });
    });
  });

  describe('Get All Houses API', () => {
    const url = '/house';

    beforeAll(() => {
      request(app.getHttpServer())
        .post(url)
        .set('Authorization', `Bearer ${token}`)
        .send(fakeRoomData)
        .expect(201);
    });

    afterAll(async () => {
      const prisma = new PrismaClient();
      await prisma.houses.deleteMany({
        where: {
          address: fakeRoomData.address,
          area: fakeRoomData.area,
          price: fakeRoomData.price,
        },
      });
    });
    it('get all working correctly', () => {
      return request(app.getHttpServer())
        .get(url)
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
  });
});
