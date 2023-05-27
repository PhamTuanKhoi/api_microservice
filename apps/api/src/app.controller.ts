import { AuthGuard } from '@app/shared';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
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

  @UseGuards(AuthGuard)
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

  @Post('login')
  login(@Body() loginRequest: LoginRequest) {
    return this.authClient.send({ cmd: 'login' }, loginRequest);
  }
}
