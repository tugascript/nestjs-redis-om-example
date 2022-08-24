import { Entity, Schema } from 'redis-om';

export class User extends Entity {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export const userSchema = new Schema(User, {
  name: { type: 'string' },
  email: { type: 'string' },
  password: { type: 'string' },
  createdAt: { type: 'date' },
});
