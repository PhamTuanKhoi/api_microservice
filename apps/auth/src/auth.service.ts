import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getusers() {
    return this.userRepository.find();
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async postUser() {
    return this.userRepository.save({ firstName: 'mercdess' });
  }

  async register(createUserDto: Readonly<CreateUserDto>): Promise<UserEntity> {
    let { password, email } = createUserDto;

    const user = await this.findByEmail(email);

    if (user) throw new ConflictException('email already exists!');

    password = await bcrypt.hash(password, 10);

    const created = await this.userRepository.save({
      ...createUserDto,
      password,
    });

    delete created.password;

    return created;
  }
}
