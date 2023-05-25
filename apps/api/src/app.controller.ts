import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get()
  getUsers() {
    return this.authClient.send({ cmd: 'get-users' }, {});
  }

  @Post()
  postUser() {
    return this.authClient.send({ cmd: 'post-user' }, {});
  }
}
