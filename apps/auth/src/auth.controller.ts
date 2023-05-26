import { SharedService } from '@app/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async list(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.getusers();
  }

  @MessagePattern({ cmd: 'post-user' })
  async create(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.postUser();
  }

  @MessagePattern({ cmd: 'register' })
  async register(
    @Ctx() context: RmqContext,
    @Payload() registerRequest: CreateUserDto,
  ) {
    this.sharedService.acknowledgeMessage(context);

    return this.authService.register(registerRequest);
  }
}
