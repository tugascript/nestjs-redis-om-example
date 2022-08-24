import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'redis-om';

@Injectable()
export class RedisClientService extends Client {
  constructor(private readonly configService: ConfigService) {
    super();
    (async () => {
      await this.open(configService.get<string>('redisUrl'));
    })();
  }
}
