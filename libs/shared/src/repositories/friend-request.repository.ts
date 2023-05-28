import {
  BaseAbstractRepository,
  FriendRequestEntity,
  FriendRequestRepositoryInterface,
} from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class FriendRequestRepository
  extends BaseAbstractRepository<FriendRequestEntity>
  implements FriendRequestRepositoryInterface
{
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly FriendRequestRepositorySuper: Repository<FriendRequestEntity>,
  ) {
    super(FriendRequestRepositorySuper);
  }
}
