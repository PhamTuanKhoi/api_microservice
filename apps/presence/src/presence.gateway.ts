import { UserJwt } from '@app/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ActiveUser } from './interfaces/ActiveUser.interface';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PresenceGateway.name);
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @WebSocketServer()
  server: Server;

  async onModuleInit() {
    await this.cache.reset();
  }

  async handleConnection(socket: Socket) {
    console.log('HANDLE CONNECTION');

    const jwt = socket.handshake.headers.authorization ?? null;

    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    // ob$ => $ is represent the invisible
    const ob$ = this.authClient.send<UserJwt>({ cmd: 'decode-jwt' }, { jwt });
    // can write .pipe(swithMap) -> do ortherwise
    const res = await firstValueFrom(ob$).catch((error) =>
      this.logger.error(error),
    );

    if (!res || !res?.user) {
      this.handleDisconnect(socket);
      return;
    }

    const { user } = res;

    socket.data.user = user;

    await this.setActiveStatus(socket, true);
  }

  async handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECTION');
    await this.setActiveStatus(socket, false);
  }

  private async setActiveStatus(socket: Socket, isActive: boolean) {
    const user = socket?.data?.user;

    if (!user) return;

    const activeUser: ActiveUser = {
      id: user?.id,
      sotketId: socket.id,
      isActive: isActive,
    };

    await this.cache.set(`user ${user.id}`, activeUser, 0);
    await this.emitStatusToFriend(activeUser);
  }

  private async emitStatusToFriend(activeUser: ActiveUser) {
    const friends = await this.getFriends(activeUser.id);

    for (const f of friends) {
      const user = await this.cache.get(`user ${f.id}`);

      if (!user) continue;

      const friend = user as ActiveUser;

      this.server.to(friend.sotketId).emit(`friendActive`, {
        id: activeUser.id,
        isActive: activeUser.isActive,
      });

      if (activeUser.isActive) {
        this.server.to(activeUser.sotketId).emit(`friendActive`, {
          id: friend.id,
          isActive: friend.isActive,
        });
      }
    }
  }

  private async getFriends(userId: number) {
    const ob$ = this.authClient.send({ cmd: 'get-friend' }, { userId });
    return await firstValueFrom(ob$).catch((error) => this.logger.error(error));
  }
}
