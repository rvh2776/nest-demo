import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.interface';

@Injectable()
export class UsersServices {
  constructor(
    private usersRepository: UsersRepository,
    @Inject('API_USERS') private apiUSers: User[],
  ) {}

  async getUsers() {
    const dbUsers = await this.usersRepository.getUsers();
    const users = [...dbUsers, ...this.apiUSers];
    return users;
  }

  getUserById(id: number) {
    return this.usersRepository.getById(id);
  }

  // Para filtrar un nombre o lo que sea por query en la consulta tiene que ir: /users?name=Tota
  getUserByName(name: string) {
    return this.usersRepository.getByName(name);
  }

  createUser(user: Omit<User, 'id'>): Promise<User> {
    return this.usersRepository.createUser(user);
  }
}
