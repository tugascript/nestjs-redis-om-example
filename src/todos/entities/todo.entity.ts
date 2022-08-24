import { Entity, Schema } from 'redis-om';

export class Todo extends Entity {
  body: string;
  completed: boolean;
  createdAt: Date;
  author: string;
}

export const todoSchema = new Schema(Todo, {
  body: { type: 'string' },
  completed: { type: 'boolean' },
  createdAt: { type: 'date' },
  author: { type: 'string' },
});
