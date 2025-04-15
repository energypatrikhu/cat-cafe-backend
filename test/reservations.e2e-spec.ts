import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let workerToken: string;
  let reservationId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userLoginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'user@cat-cafe.hu',
        password: 'user-pass-123',
      });

    userToken = userLoginResponse.body.token;

    const workerLoginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'worker@cat-cafe.hu',
        password: 'worker-pass-123',
      });

    workerToken = workerLoginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/reservations (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        date: new Date().toISOString(),
      })
      .expect(201);

    reservationId = response.body.id;
    expect(response.body).toHaveProperty('id');
  });

  it('/reservations (POST) - conflict error', async () => {
    await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        date: new Date().toISOString(),
      })
      .expect(403);
  });

  it('/reservations (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/reservations/:id (GET) - not found', async () => {
    await request(app.getHttpServer())
      .get('/reservations/9999')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });

  it('/reservations/:id (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get(`/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', reservationId);
  });

  it('/reservations/:id (PATCH) - success (worker)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        active: false,
      })
      .expect(200);

    expect(response.body).toHaveProperty('active', false);
  });

  it('/reservations/:id (DELETE) - success (worker)', async () => {
    await request(app.getHttpServer())
      .delete(`/reservations/${reservationId}`)
      .set('Authorization', `Bearer ${workerToken}`)
      .expect(200);
  });
});
