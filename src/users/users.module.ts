import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersServices } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersDbService } from './usersDb.service';
// import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryConfig } from '../config/cloudinary'; //! Se cambio para los test.
import { CloudinaryService } from './cloudinary.service';
// import { LoguerMiddleware } from 'src/middlewares/logger.middleware';
import { AuthService } from './auth.service';
import { requiresAuth } from 'express-openid-connect';

// const mockUserService = {
//   getUsers: () => 'Esto es un servicio mock de usuarios',
// };

@Module({
  // providers: [
  //   {
  //     provide: UsersServices,
  //     useValue: mockUserService,
  //   },
  //   UsersRepository,
  // ],

  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersServices,
    UsersDbService,
    UsersRepository,
    CloudinaryConfig,
    CloudinaryService,
    AuthService,
    {
      provide: 'API_USERS',
      useFactory: async () => {
        const apiUsers = await fetch(
          'https://jsonplaceholder.typicode.com/users',
        ).then((response) => response.json());
        return apiUsers.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        });
      },
    },
  ],

  // providers: [UsersServices, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoguerMiddleware).forRoutes('users');
    consumer.apply(requiresAuth()).forRoutes('users/auth0/protected');
  }
}
