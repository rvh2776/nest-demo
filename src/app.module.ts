import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';

// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './guards/auth.guard';

// import * as dotenv from 'dotenv';
// dotenv.config({ path: './.env.development' });
// console.log(process.env.DB_PASSWORD);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),

    UsersModule,
    TodosModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [],
  providers: [],

  //? para implementar una guardia desde el modulo padre de la app
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: AuthGuard,
  //   },
  // ],
  //? Para implementar un interceptor desde el modulo padre de la app.
  // providers: [
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: MyInterceptor
  //   },
  // ],
})
export class AppModule {}
