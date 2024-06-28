/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { exec } from 'child_process';
// import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //? Ejecutar miraciones antes de iniciar el proyecto.
  await new Promise<void>((resolve, reject) => {
    exec('./migraciones.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando entorno:\n${error}`);
        reject(error);
        return;
      }
      console.log(`\nComprobando migraciones.\n\n${stdout}`);
      resolve();
    });
  });

  //* Crea una guardia en general para todas las peticiones a la api.
  // app.useGlobalGuards(new AuthGuard());
  //* Crea un interceptor en general para todas las peticiones.
  // app.useGlobalInterceptors(new MyInterceptor())

  //* Configuracion de Auth0
  app.use(auth(auth0Config));

  //* Validador globar de Pipes.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return { property: error.property, constraints: error.constraints };
        });
        return new BadRequestException({
          alert:
            'Se han detectado lo siguientes errores en la peticion y te mandamos este mensaje personalizado',
          errors: cleanErrors,
        });
      },
    }),
  );
  app.use(loggerGlobal);

  //* Integrar Swagger, para documentar la API.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription(
      `Esta es un API construida con Nest para ser empleada en las demos del modulo M4 de la especialidad Backend de la carrera Fullstack Developer de Henry`,
    )
    .setVersion('1.0')
    .addBearerAuth() // Este parametro nos permite pasar token de autorizacion a las pruebas de la API, se pueden agregar diferentes tipos de autorizacion.
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
