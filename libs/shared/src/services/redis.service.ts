import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get(key: string) {
    this.logger.debug(`GET ${key} from REDIS`);
    return this.cache.get(key);
  }
  async set(key: string, value: unknown) {
    this.logger.debug(`SET ${key} from REDIS`);
    return this.cache.set(key, value);
  }
  async delete(key: string) {
    this.logger.debug(`DEL ${key} from REDIS`);
    return this.cache.del(key);
  }
}
