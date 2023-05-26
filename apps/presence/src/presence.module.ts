import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({
  imports: [SharedModule],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
