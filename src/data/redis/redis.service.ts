import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const redisPassword = this.configService.get('REDIS_PASSWORD');
    const redisUser = this.configService.get('REDIS_USER');
    const redisHost = this.configService.get('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');

    Logger.log(redisPort);

    this.client = createClient({
      password: redisPassword,
      username: redisUser,
      socket: {
        host: redisHost,
        port: Number(redisPort),
      },
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async get<T = unknown>(key: string) {
    const data = await this.client.get(key);
    return JSON.parse(data) as T;
  }

  async getAll<T = unknown>() {
    const allKeys = await this.client.keys('*');

    const allData: T[] = [];

    for (const key of allKeys) {
      allData.push(await this.get(key));
    }

    return allData;
  }

  async set(key: string, value: any, expire = 3600) {
    const redis = await this.client.set(key, JSON.stringify(value), {
      EX: expire,
    });
    return redis;
  }
}
