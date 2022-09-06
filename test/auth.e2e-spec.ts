import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';

const password = `Alijon+${Math.floor(Math.random() * 10000)}!`;

export const fakeUserData = {
  name: 'Alijon',
  phone: '+998912345678',
  email: `alijon${Math.floor(Math.random() * 100)}@gmail.com`,
  password: password,
  confirmPassword: password,
};

export const fakeSignInData = {
  email: fakeUserData.email,
  password: fakeUserData.password,
};

const registerUser = (app: INestApplication) => {
  return request(app.getHttpServer())
    .post('/auth/signup')
    .send(fakeUserData)
    .expect(201)
    .expect({ error: false, message: 'Successfully registered' });
};

const signIn = (app: INestApplication) => {
  return request(app.getHttpServer())
    .post('/auth/signin')
    .send(fakeSignInData)
    .then((res) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.access_token).toBeDefined();
      return res.body.access_token;
    });
};

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('Sign up API', () => {
    afterAll(async () => {
      const prisma = new PrismaClient();
      await prisma.users.deleteMany({ where: { email: fakeUserData.email } });
    });

    const url = '/auth/signup';

    it('register working correctly', () => {
      return registerUser(app);
    });

    it('registering with exact email', () => {
      return request(app.getHttpServer())
        .post(url)
        .send(fakeUserData)
        .expect(400)
        .expect({ error: true, message: 'Credentials taken' });
    });

    it('registering with empty body', () => {
      return request(app.getHttpServer())
        .post(url)
        .send({})
        .then((res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error).toEqual(true);
          expect(res.body.message.message).toEqual([
            'name must be a string',
            'name should not be empty',
            'phone must be a valid phone number',
            'phone should not be empty',
            'email must be an email',
            'email should not be empty',
            'Password too weak',
            'password must be a string',
            'password should not be empty',
          ]);
        });
    });

    it('sending wrong email', () => {
      return request(app.getHttpServer())
        .post(url)
        .send({ ...fakeUserData, email: 'asasas' })
        .expect(400)
        .expect({
          error: true,
          message: {
            statusCode: 400,
            message: ['email must be an email'],
            error: 'Bad Request',
          },
        });
    });

    it('sending without confirm password', () => {
      const fake = { ...fakeUserData };
      delete fake.confirmPassword;
      return request(app.getHttpServer())
        .post(url)
        .send(fake)
        .expect(400)
        .expect({
          error: true,
          message: {
            statusCode: 400,
            message: ['Confirm password is different from password'],
            error: 'Bad Request',
          },
        });
    });

    it('sending different confirm password', () => {
      const fake = { ...fakeUserData };
      fake.confirmPassword = '54546546546';
      return request(app.getHttpServer())
        .post(url)
        .send(fake)
        .expect(400)
        .expect({
          error: true,
          message: {
            statusCode: 400,
            message: ['Confirm password is different from password'],
            error: 'Bad Request',
          },
        });
    });
  });

  describe('Sign In API', () => {
    const url = '/auth/signin';

    beforeAll(() => registerUser(app));

    afterAll(async () => {
      const prisma = new PrismaClient();
      await prisma.users.deleteMany({ where: { email: fakeUserData.email } });
    });

    it('sign in working correctly', () => {
      return signIn(app);
    });

    it('sending empty body', () => {
      return request(app.getHttpServer())
        .post(url)
        .send({})
        .then((res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.message).toEqual([
            'email must be an email',
            'email should not be empty',
            'password must be a string',
            'password should not be empty',
          ]);
        });
    });
  });
});
