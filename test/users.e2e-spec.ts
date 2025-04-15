import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  let name = `testuser-${Date.now()}`;
  let email = `testuser-${Date.now()}@example.com`;
  let password = 'StrongP@ssw0rd!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users/register (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name,
        email,
        password,
      })
      .expect(201);

    expect(response.text).toEqual('User created');
  });

  it('/users/register (POST) - validation error', async () => {
    await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: '',
        email: 'invalid-email',
        password: 'weak',
      })
      .expect(400);
  });

  it('/users/login (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email,
        password,
      })
      .expect(201);

    token = response.body.token;
    expect(response.body).toHaveProperty('token');
  });

  it('/users/login (POST) - invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      })
      .expect(400);
  });

  it('/users/me (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('name', name);
  });

  it('/users/me (GET) - unauthorized', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('/users/logout (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .delete('/users/logout')
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });
});
