import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from "src/review/dto/create-review.dto";
import { disconnect, Types } from "mongoose";
import { AuthDto } from "src/auth/dto/auth.dto";

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: 'a2@g.ru',
  password: '1',
};

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Title',
  description: 'Test description',
  rating: 5,
  productId,
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    
    token = body.access_token;
  });

  it('/review/create (POST)', async (done) => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({body}: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/byProduct/:productId (GET) - success', async (done) => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
        done();
      });
  });

  it('/byProduct/:productId (GET) - fail', async (done) => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${new Types.ObjectId().toHexString()}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
        done();
      });
  });

  it('/review/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
