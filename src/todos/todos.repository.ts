import { Injectable } from '@nestjs/common';

@Injectable()
export class TodosRepository {
  private todos = [
    {
      id: 1,
      title: 'Todo 1',
      desciption: 'Description 1',
      isCompleted: false,
    },
    {
      id: 2,
      title: 'Todo 2',
      desciption: 'Description 2',
      isCompleted: false,
    },
    {
      id: 3,
      title: 'Todo 3',
      desciption: 'Description 3',
      isCompleted: false,
    },
  ];

  async getTodos() {
    return this.todos;
  }
}
