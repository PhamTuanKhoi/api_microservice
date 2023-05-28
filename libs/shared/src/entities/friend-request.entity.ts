import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('friend-request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.friendRequestCreator)
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.friendRequestReceiver)
  receiver: UserEntity;
}
