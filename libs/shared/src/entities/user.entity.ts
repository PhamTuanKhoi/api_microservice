import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FriendRequestEntity } from './friend-request.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: false })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequest) => friendRequest.creator,
  )
  friendRequestCreator: FriendRequestEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequest) => friendRequest.receiver,
  )
  friendRequestReceiver: FriendRequestEntity[];
}
