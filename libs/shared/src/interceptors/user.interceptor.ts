import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, switchMap } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest();

    const authHeader = request?.headers['authorization'];

    if (!authHeader) return next.handle();

    const authPart = authHeader.split(' ');

    if (authPart.length !== 2) return next.handle();

    const [, jwt] = authPart;

    return this.authClient.send({ cmd: 'decode-jwt' }, { jwt }).pipe(
      switchMap(({ user }) => {
        request.user = user;
        return next.handle();
      }),
      catchError(() => {
        return next.handle();
      }),
    );
  }
}
