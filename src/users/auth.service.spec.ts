import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersDbService } from './usersDb.service';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('authservice', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersDbService>;

  const mockUser: Omit<User, 'id'> = {
    name: 'Rafael',
    createdAt: '10/06/2024',
    password: '123456',
    email: 'rafael.vh@gmail.com',
    isAdmin: false,
  };

  beforeEach(async () => {
    mockUsersService = {
      getUserByEmail: () => Promise.resolve(undefined),
      saveUser: (user: Omit<User, 'id'>): Promise<any> =>
        Promise.resolve({
          ...user,
          isAdmin: false,
          id: '7a904eed-9370-43e6-98f2-c46b7910d84b',
        }),
    };

    const mockJwtService = {
      sign: (payload) => jwt.sign(payload, 'testSecret'),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersDbService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('Create an instance of AuthService', async () => {
    expect(authService).toBeDefined();
  });

  it('signUp() crear un nuevo usuario con password encriptado', async () => {
    const user = await authService.signUp(mockUser);
    expect(user).toBeDefined();
    expect(user.password).not.toEqual(mockUser.password);
  });

  it('signUp() retorna error si el email ya existe en usuarios', async () => {
    // mockUsersService.getUserByEmail = (email: string) =>
    //   Promise.resolve(mockUser as User);
    mockUsersService.getUserByEmail = () => Promise.resolve(mockUser as User);

    try {
      await authService.signUp(mockUser as User);
    } catch (error) {
      expect(error.message).toEqual(
        `El email: ${mockUser.email} ya existe en el sistema`,
      );
    }
  });

  it('signIn() retorna error si el password es invalido', async () => {
    // mockUsersService.getUserByEmail = (email: string) =>
    //   Promise.resolve(mockUser as User);
    mockUsersService.getUserByEmail = () => Promise.resolve(mockUser as User);

    try {
      await authService.signIn(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error.message).toEqual('El password no es valido');
    }
  });

  it('signIn() retorna error si el usuario no existe', async () => {
    try {
      await authService.signIn(mockUser.email, mockUser.password);
    } catch (error) {
      expect(error.message).toEqual('El usuario no existe');
    }
  });

  it('signIn() retorna un objeto con un mensaje y el token si el usuario y el password es valido', async () => {
    const mockUserVariant = {
      ...mockUser,
      password: await bcrypt.hash(mockUser.password, 10),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mockUsersService.getUserByEmail = (email: string) =>
      Promise.resolve(mockUserVariant as User);

    const reponse = await authService.signIn(mockUser.email, mockUser.password);

    expect(reponse).toBeDefined();
    expect(reponse.token).toBeDefined();
    expect(reponse.success).toEqual('User logged in successfully');
  });
});
