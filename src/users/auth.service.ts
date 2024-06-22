import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { UsersDbService } from './usersDb.service';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// import { Role } from 'src/roles.enum';
import { Role } from '../roles.enum'; //! Cambio echo para que acepte las pruebas.

@Injectable()
export class AuthService {
  constructor(
    private readonly usersDbService: UsersDbService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: Omit<User, 'id'>) {
    const dbUser = await this.usersDbService.getUserByEmail(user.email);

    if (dbUser) {
      throw new BadGatewayException(
        `El email: ${dbUser.email} ya existe en el sistema`,
      );
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (!hashedPassword) {
      throw new BadRequestException('El password no se pudo encriptar');
    }
    // await this.usersDbService.saveUser({ ...user, password: hashedPassword });
    return this.usersDbService.saveUser({ ...user, password: hashedPassword }); //! Cambiado para hacer las pruebas.

    // return { success: 'Usuario creado con exito!' };
  }

  async signIn(email: string, password: string) {
    const dbUser = await this.usersDbService.getUserByEmail(email);

    if (!dbUser) {
      throw new BadRequestException('El usuario no existe');
    }

    const IsPasswordValid = await bcrypt.compare(password, dbUser.password);

    if (!IsPasswordValid) {
      throw new BadRequestException('El password no es valido');
    }

    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      // isAdmin: dbUser.isAdmin,
      roles: [dbUser.isAdmin ? Role.Admin : Role.User],
    };

    const token = this.jwtService.sign(userPayload);

    return { success: 'User logged in successfully', token };
  }
}
