import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'test@gmail.com',
  password: '12345',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
        done();
      });
  });

  it('/review/create (POST) - fail password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '123' })
      .expect(401, {
        statusCode: 401,
        message: 'Неверный пароль',
        error: 'Unauthorized',
      });
  });

  it('/review/create (POST) - fail login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'testttt@gmail.com' })
      .expect(401, {
        statusCode: 401,
        message: 'Пользователь с таким email не найден',
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
