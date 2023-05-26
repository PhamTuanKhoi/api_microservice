import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('PRESENCE_SERVICE') private readonly presenceClient: ClientProxy,
  ) {}

  @Get()
  getUsers() {
    return this.authClient.send({ cmd: 'get-users' }, {});
  }

  @Get('presence')
  getPresence() {
    return this.presenceClient.send({ cmd: 'get-presence' }, {});
  }

  @Post()
  postUser() {
    return this.authClient.send({ cmd: 'post-user' }, {});
  }

  @Post('register')
  register(@Body() registerRequest: RegisterRequest) {
    return this.authClient.send({ cmd: 'register' }, registerRequest);
  }
}
