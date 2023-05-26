import { SharedService } from '@app/shared';
import { AuthGaurd } from '@app/shared/auth.guard';
import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    private readonly authGaurd: AuthGaurd,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async list(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    console.log(1, this.authGaurd.hasJwt());

    return this.presenceService.getHello();
  }
}
