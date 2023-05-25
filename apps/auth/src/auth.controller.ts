import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'get-users' })
  async list(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const meesage = context.getMessage();

    // confirm message handled success
    channel.ack(meesage);

    return this.authService.getusers();
  }

  @MessagePattern({ cmd: 'post-user' })
  async create(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const meesage = context.getMessage();

    // confirm message handled success
    channel.ack(meesage);

    return this.authService.postUser();
  }
}
