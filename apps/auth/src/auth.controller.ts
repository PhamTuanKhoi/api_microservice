import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern({ cmd: 'get-user' })
  async list(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const meesage = context.getMessage();

    // confirm message handled success
    channel.ack(meesage);
    console.log(context);

    return { user: 'USER' };
  }
}
