import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //   it('/ (GET)', () => {
  //     return request(app.getHttpServer())
  //       .get('/')
  //       .expect(200)
  //       .expect('Hello World!');
  //   });

  it('Get /users/ retorna un array de usuarios y status code ok', async () => {
    const req = await request(app.getHttpServer()).get('/users');
    // console.log(req);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('Get /users/ retorna un usuario por id y status code ok', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/20c9b107-485b-409e-ae7d-b255235f4e93',
    );
    // console.log(req);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('Get /users/:id se busca usuario por id, si no existe retorna un mensaje: Usuario no encontrado', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/20c9b107-485b-409e-ae7d-b255235f4e94',
    );
    // console.log(req);

    expect(req.status).toBe(400);
    expect(req.body.message).toBe(
      `El usuario con id: 20c9b107-485b-409e-ae7d-b255235f4e94 no existe`,
    );
  });

  it('Get /users/:id se busca usuario por id, si uuid no es valido devuelve error', async () => {
    const req = await request(app.getHttpServer()).get('/users/not-a-uuid');
    // console.log(req);

    expect(req.status).toBe(400);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('Post /users/signup crear usuario y retorna status code ok', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });

    expect(req.status).toBe(201);
    expect(req.body).toBeInstanceOf(Object);
  });
});
