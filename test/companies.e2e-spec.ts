import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/companies (POST)', () => {
    return request(app.getHttpServer())
      .post('/companies')
      .send({
        name: 'Test Company',
        taxId: '30-12345678-9',
        address: 'Test Address',
        phone: '123456789',
        email: 'test@company.com',
        registrationDate: new Date(),
      })
      .expect(201);
  });

  it('/companies (GET)', () => {
    return request(app.getHttpServer())
      .get('/companies')
      .expect(200);
  });

  it('/companies/:id (GET)', async () => {
    const postResponse = await request(app.getHttpServer())
      .post('/companies')
      .send({
        name: 'Test Company',
        taxId: '30-12345678-9',
        address: 'Test Address',
        phone: '123456789',
        email: 'test@company.com',
        registrationDate: new Date(),
      });

    return request(app.getHttpServer())
      .get(`/companies/${postResponse.body.data.id}`)
      .expect(200);
  });
});
