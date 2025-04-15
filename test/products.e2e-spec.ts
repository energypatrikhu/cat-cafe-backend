import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let workerToken: string;
  let userToken: string;
  let productId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const workerLoginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'worker@cat-cafe.hu',
        password: 'worker-pass-123',
      });

    workerToken = workerLoginResponse.body.token;

    const userLoginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'user@cat-cafe.hu',
        password: 'user-pass-123',
      });

    userToken = userLoginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST) - success (worker)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${workerToken}`)
      .field('name', 'Test Product')
      .field('description', 'A test product')
      .field('price', 10.99)
      .field('quantity', 100)
      .attach('image', Buffer.from('test'), 'test.png')
      .expect(201);

    productId = response.body.id;
    expect(response.body).toHaveProperty('id');
  });

  it('/products (POST) - forbidden (user)', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .field('name', 'Test Product')
      .field('description', 'A test product')
      .field('price', 10.99)
      .field('quantity', 100)
      .attach('image', Buffer.from('test'), 'test.png')
      .expect(403);
  });

  it('/products (POST) - validation error', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${workerToken}`)
      .field('name', '')
      .field('description', 'A test product')
      .field('price', -10.99)
      .field('quantity', -1)
      .expect(400);
  });

  it('/products (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/products/:id (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', productId);
  });

  it('/products/:id (GET) - not found', async () => {
    await request(app.getHttpServer()).get('/products/9999').expect(404);
  });

  it('/products/:id (PATCH) - success (worker)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${workerToken}`)
      .field('name', 'Updated Product')
      .field('description', 'Updated description')
      .field('price', 15.99)
      .field('quantity', 50)
      .attach('image', Buffer.from('test'), 'test.png')
      .expect(200);

    expect(response.body).toHaveProperty('name', 'Updated Product');
  });

  it('/products/:id (PATCH) - forbidden (user)', async () => {
    await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .field('name', 'Updated Product')
      .expect(403);
  });

  it('/products/:id (DELETE) - success (worker)', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${workerToken}`)
      .expect(200);
  });

  it('/products/:id (DELETE) - forbidden (user)', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('/products (PATCH) - buy products (user)', async () => {
    const response = await request(app.getHttpServer())
      .patch('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        products: [
          {
            id: productId,
            quantity: 1,
          },
        ],
      })
      .expect(200);

    expect(response.body).toEqual('Products bought successfully');
  });
});
