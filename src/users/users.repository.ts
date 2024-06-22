import { Injectable } from '@nestjs/common';
import { User } from './users.interface';

@Injectable()
export class UsersRepository {
  private users: User[] = [
    {
      id: 1,
      name: 'Bartolo',
      email: 'bartolo@example.com',
    },
    {
      id: 2,
      name: 'Tota',
      email: 'tota@example.com',
    },
    {
      id: 3,
      name: 'Gama',
      email: 'gama@example.com',
    },
  ];

  async getUsers() {
    return this.users;
  }

  async getById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  // Para filtrar un nombre o lo que sea por query en la consulta tiene que ir: /users?name=Tota
  async getByName(name: string) {
    return this.users.find((user) => user.name === name);
  }

  async createUser(user: Omit<User, 'id'>) {
    const id = this.users.length + 1;
    this.users = [...this.users, { id, ...user }];
    return { id, ...user };
  }
}
