import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException();

    const path = (authHeader as string).split(' '); // ['Bearer', 'token']

    if (path.length !== 2) return false;

    const [, jwt] = path; // array ['Bearer', 'token'] => jwt = token

    return this.authClient.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
      switchMap(({ exp }) => {
        if (!exp) return of(false);
        // exp = ( Date.now() register + expiresIn ) as second
        const TOKEN_EXP_MS = exp * 1000; // second to milisecond

        const isJwtValid = TOKEN_EXP_MS > Date.now();

        return of(isJwtValid);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );

    // return this.authClient.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
    //   map(({ exp }) => {
    //     if (!exp) return false;
    //     // exp = ( Date.now() register + expiresIn ) as second
    //     const TOKEN_EXP_MS = exp * 1000; // second to milisecond

    //     const isJwtValid = TOKEN_EXP_MS > Date.now();

    //     return isJwtValid;
    //   }),
    //   catchError(() => {
    //     throw new UnauthorizedException();
    //   }),
    // );
  }
}
