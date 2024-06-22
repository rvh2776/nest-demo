import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersDbService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers() {
    return await this.usersRepository.find();
  }

  async getUserByName(name: string) {
    const userName = await this.usersRepository.find({ where: { name } });
    console.log(userName);
    return userName;
  }

  async saveUser(user: Omit<User, 'id'>) {
    // await this.usersRepository.save(user);
    return this.usersRepository.save(user); //! Cambiado para hacer las pruebas.
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`El usuario con id: ${id} no existe`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isAdmin, ...userOut } = user;

    return userOut;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}
