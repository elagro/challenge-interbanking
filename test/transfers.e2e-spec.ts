import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TransferController (e2e)', () => {
  let app: INestApplication;
  let companyId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const companyResponse = await request(app.getHttpServer())
      .post('/companies')
      .send({
        name: 'Test Company',
        cuit: '30-12345678-9',
        address: 'Test Address',
        phone: '123456789',
        email: 'test@company.com',
        registrationDate: new Date(),
      });
    companyId = companyResponse.body.data.id;
  });

  it('/transfers (POST)', () => {
    return request(app.getHttpServer())
      .post('/transfers')
      .send({
        companyIdFrom: companyId,
        accountIdFrom: '123',
        amount: 100,
        currency: 'USD',
        companyIdTo: '456',
        accountIdTo: '789',
        concept: 'Test Transfer',
        reference: '123456',
        controlNumber: '789123',
        effectiveDate: new Date(),
      })
      .expect(201);
  });

  it('/transfers (GET)', () => {
    return request(app.getHttpServer())
      .get('/transfers')
      .expect(200);
  });
});
