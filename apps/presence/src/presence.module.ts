import { RedisModule, SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    RedisModule,
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
