import { IJwt } from './jwt.interface';

export interface IConfig {
  redisUrl: string;
  port: number;
  jwt: IJwt;
}
