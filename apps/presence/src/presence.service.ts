// import { RedisService } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  // constructor(private readonly cacheService: RedisService) {}
  getFoo() {
    console.log('GET key from REDIS');

    return { foo: 'okay' };
  }
}
