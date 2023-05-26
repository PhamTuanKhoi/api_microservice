import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGaurd {
  hasJwt() {
    return { jwt: 'token' };
  }
}
